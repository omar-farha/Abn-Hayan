-- Create exam management tables

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
  total_duration INTEGER NOT NULL, -- in minutes
  per_question_time_limit INTEGER, -- in seconds, optional
  is_active BOOLEAN DEFAULT true,
  created_by VARCHAR(8) NOT NULL REFERENCES access_codes(code) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exam_questions table
CREATE TABLE IF NOT EXISTS exam_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_image_url TEXT, -- optional image attachment
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT,
  option_d TEXT,
  correct_answers TEXT[] NOT NULL, -- array to support multiple correct answers
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exam_attempts table
CREATE TABLE IF NOT EXISTS exam_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  user_code VARCHAR(8) NOT NULL REFERENCES access_codes(code) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  time_taken INTEGER, -- in seconds
  total_score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exam_answers table
CREATE TABLE IF NOT EXISTS exam_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES exam_questions(id) ON DELETE CASCADE,
  selected_answers TEXT[] DEFAULT '{}', -- array to support multiple selections
  is_correct BOOLEAN DEFAULT false,
  points_earned INTEGER DEFAULT 0,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exams_course ON exams(course_id);
CREATE INDEX IF NOT EXISTS idx_exams_active ON exams(is_active);
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam ON exam_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_order ON exam_questions(exam_id, order_index);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam ON exam_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user ON exam_attempts(user_code);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_completed ON exam_attempts(is_completed);
CREATE INDEX IF NOT EXISTS idx_exam_answers_attempt ON exam_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_exam_answers_question ON exam_answers(question_id);

-- Enable RLS on exam tables
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_answers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all operations on exams" ON exams FOR ALL USING (true);
CREATE POLICY "Allow all operations on exam_questions" ON exam_questions FOR ALL USING (true);
CREATE POLICY "Allow all operations on exam_attempts" ON exam_attempts FOR ALL USING (true);
CREATE POLICY "Allow all operations on exam_answers" ON exam_answers FOR ALL USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exam_questions_updated_at BEFORE UPDATE ON exam_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exam_attempts_updated_at BEFORE UPDATE ON exam_attempts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate exam results
CREATE OR REPLACE FUNCTION calculate_exam_results(attempt_uuid UUID)
RETURNS void AS $$
DECLARE
  total_points INTEGER := 0;
  earned_points INTEGER := 0;
  percentage_score DECIMAL(5,2);
BEGIN
  -- Calculate total possible points
  SELECT COALESCE(SUM(eq.points), 0) INTO total_points
  FROM exam_questions eq
  JOIN exam_attempts ea ON eq.exam_id = ea.exam_id
  WHERE ea.id = attempt_uuid;
  
  -- Calculate earned points
  SELECT COALESCE(SUM(ea_ans.points_earned), 0) INTO earned_points
  FROM exam_answers ea_ans
  WHERE ea_ans.attempt_id = attempt_uuid;
  
  -- Calculate percentage
  IF total_points > 0 THEN
    percentage_score := (earned_points::DECIMAL / total_points::DECIMAL) * 100;
  ELSE
    percentage_score := 0;
  END IF;
  
  -- Update exam attempt with results
  UPDATE exam_attempts 
  SET 
    total_score = earned_points,
    max_score = total_points,
    percentage = percentage_score,
    is_completed = true,
    submitted_at = NOW()
  WHERE id = attempt_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create function to grade individual answers
CREATE OR REPLACE FUNCTION grade_exam_answer(
  attempt_uuid UUID,
  question_uuid UUID,
  user_answers TEXT[]
)
RETURNS void AS $$
DECLARE
  correct_answers TEXT[];
  question_points INTEGER;
  is_answer_correct BOOLEAN := false;
  points_to_award INTEGER := 0;
BEGIN
  -- Get correct answers and points for the question
  SELECT eq.correct_answers, eq.points INTO correct_answers, question_points
  FROM exam_questions eq
  WHERE eq.id = question_uuid;
  
  -- Check if user answers match correct answers
  IF user_answers @> correct_answers AND correct_answers @> user_answers THEN
    is_answer_correct := true;
    points_to_award := question_points;
  END IF;
  
  -- Insert or update the answer
  INSERT INTO exam_answers (attempt_id, question_id, selected_answers, is_correct, points_earned)
  VALUES (attempt_uuid, question_uuid, user_answers, is_answer_correct, points_to_award)
  ON CONFLICT (attempt_id, question_id)
  DO UPDATE SET
    selected_answers = EXCLUDED.selected_answers,
    is_correct = EXCLUDED.is_correct,
    points_earned = EXCLUDED.points_earned,
    answered_at = NOW();
END;
$$ LANGUAGE plpgsql;
