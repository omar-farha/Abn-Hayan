export interface Session {
  id: string
  title: string
  description: string
  content: string
  assignment: string
  tasks?: string[]
  videoUrl?: string
}

export interface Course {
  id: string
  title: string
  description: string
  icon: string
  sessions: Session[]
}

export interface Project {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  technologies: string[]
  requirements: string[]
  instructions: string
  demoUrl?: string
  sourceCode?: string
  estimatedTime: string
}

export interface ProjectCategory {
  id: string
  title: string
  description: string
  icon: string
  projects: Project[]
}

export const courses: Course[] = [
  {
    id: "html",
    title: "HTML",
    description:
      "Learn the foundation of web development with HTML. Master semantic markup, forms, and modern HTML5 features.",
    icon: "🏗️",
    sessions: [
      {
        id: "what-is-html",
        title: "What is HTML?",
        description: "Introduction to HTML and its role in web development",
        content:
          "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure and content of a webpage using elements and tags.",
        assignment:
          "Create your first HTML document with basic structure including DOCTYPE, html, head, and body tags.",
        tasks: [
          "Set up a basic HTML5 document structure",
          "Add a title to your webpage",
          "Include meta tags for character encoding",
          "Add a simple heading and paragraph",
        ],
      },
      {
        id: "main-code-html",
        title: "Main code in HTML",
        description: "Understanding HTML document structure and basic syntax",
        content:
          "Learn about the essential HTML document structure, including DOCTYPE declaration, html element, head section, and body content. Understand how browsers interpret HTML code.",
        assignment: "Build a complete HTML page structure with proper nesting and indentation.",
        tasks: [
          "Create a well-structured HTML document",
          "Add proper indentation and formatting",
          "Include comments to explain your code",
          "Validate your HTML using online validators",
        ],
      },
      {
        id: "main-tags",
        title: "Main Tags: h1-h6, p, img, ul/ol",
        description: "Essential HTML tags for content structure",
        content:
          "Master the most commonly used HTML tags including headings (h1-h6), paragraphs (p), images (img), and lists (ul/ol). Learn proper semantic usage and accessibility considerations.",
        assignment: "Create a webpage about your favorite hobby using headings, paragraphs, images, and lists.",
        tasks: [
          "Use all heading levels appropriately",
          "Write descriptive paragraphs",
          "Add images with proper alt attributes",
          "Create both ordered and unordered lists",
        ],
      },
      {
        id: "page-layout-media",
        title: "Page Layout + Media (video/audio)",
        description: "Structuring pages and embedding multimedia content",
        content:
          "Learn how to structure web pages using semantic HTML elements and embed multimedia content like videos and audio files. Understand different media formats and accessibility requirements.",
        assignment: "Build a multimedia portfolio page with embedded videos and audio.",
        tasks: [
          "Structure a page with header, main, and footer",
          "Embed a video with controls",
          "Add audio content with fallback options",
          "Ensure all media has proper accessibility attributes",
        ],
      },
      {
        id: "semantic-elements",
        title: "Semantic Elements",
        description: "Using HTML5 semantic elements for better structure",
        content:
          "Discover HTML5 semantic elements like header, nav, main, article, section, aside, and footer. Learn how these elements improve accessibility and SEO.",
        assignment: "Redesign a previous project using semantic HTML5 elements.",
        tasks: [
          "Replace div elements with semantic alternatives",
          "Create a proper document outline",
          "Use article and section appropriately",
          "Add navigation with proper landmarks",
        ],
      },
      {
        id: "forms-inputs-buttons",
        title: "Forms, Inputs, Buttons",
        description: "Creating interactive forms and user input elements",
        content:
          "Master HTML forms including various input types, labels, validation attributes, and form submission. Learn about accessibility and user experience best practices.",
        assignment: "Create a comprehensive contact form with validation.",
        tasks: [
          "Build a form with various input types",
          "Add proper labels and placeholders",
          "Implement client-side validation",
          "Style form elements for better UX",
        ],
      },
    ],
  },
  {
    id: "css",
    title: "CSS",
    description: "Style your websites with CSS. Learn layouts, animations, and responsive design techniques.",
    icon: "🎨",
    sessions: [
      {
        id: "what-is-css",
        title: "What is CSS & How it Works",
        description: "Introduction to CSS and its relationship with HTML",
        content:
          "CSS (Cascading Style Sheets) is used to style and layout web pages. Learn how CSS works with HTML, the cascade, inheritance, and specificity.",
        assignment: "Add basic styling to your HTML project using internal CSS.",
        tasks: [
          "Link CSS to HTML using different methods",
          "Apply basic styles to text and backgrounds",
          "Understand the cascade and specificity",
          "Use browser developer tools to inspect styles",
        ],
      },
      {
        id: "box-model",
        title: "Box Model",
        description: "Understanding the CSS box model concept",
        content:
          "Master the CSS box model including content, padding, border, and margin. Learn how box-sizing affects element dimensions and layout.",
        assignment: "Create a visual representation of the box model using CSS.",
        tasks: [
          "Demonstrate content, padding, border, and margin",
          "Use box-sizing: border-box",
          "Create spacing between elements",
          "Debug layout issues using developer tools",
        ],
      },
      {
        id: "selectors",
        title: "Selectors: ID, Class, Element",
        description: "CSS selectors and targeting specific elements",
        content:
          "Learn different types of CSS selectors including element, class, ID, attribute, and pseudo-selectors. Understand selector specificity and best practices.",
        assignment: "Style a webpage using various selector types and combinations.",
        tasks: [
          "Use element, class, and ID selectors",
          "Combine selectors for specific targeting",
          "Apply pseudo-classes and pseudo-elements",
          "Organize CSS with proper selector hierarchy",
        ],
      },
      {
        id: "units-colors-typography",
        title: "Units, Colors, Typography",
        description: "CSS units, color systems, and text styling",
        content:
          "Explore CSS units (px, em, rem, %, vw, vh), color systems (hex, rgb, hsl), and typography properties for creating visually appealing text.",
        assignment: "Design a typography-focused webpage with various units and colors.",
        tasks: [
          "Use different CSS units appropriately",
          "Apply various color formats",
          "Style text with fonts, sizes, and spacing",
          "Create a cohesive color scheme",
        ],
      },
      {
        id: "flexbox-grid",
        title: "Flexbox, Grid, Media Queries",
        description: "Modern CSS layout techniques and responsive design",
        content:
          "Master CSS Flexbox and Grid for creating flexible layouts. Learn media queries for responsive design across different screen sizes.",
        assignment: "Build a responsive layout using both Flexbox and Grid.",
        tasks: [
          "Create a flexible navigation with Flexbox",
          "Design a card layout using CSS Grid",
          "Add media queries for mobile responsiveness",
          "Test layout on different screen sizes",
        ],
      },
      {
        id: "forms-styling",
        title: "Forms Styling",
        description: "Styling form elements and improving user experience",
        content:
          "Learn to style form elements including inputs, buttons, and form layouts. Understand user experience principles and accessibility in form design.",
        assignment: "Style the contact form from the HTML course with modern CSS.",
        tasks: [
          "Style input fields and buttons",
          "Create hover and focus states",
          "Design form validation feedback",
          "Make forms mobile-friendly",
        ],
      },
      {
        id: "transitions-animations",
        title: "Transitions, Animations",
        description: "Adding motion and interactivity with CSS",
        content:
          "Create smooth transitions and keyframe animations. Learn performance considerations and best practices for web animations.",
        assignment: "Add animations and transitions to enhance user interactions.",
        tasks: [
          "Create smooth hover transitions",
          "Build keyframe animations",
          "Add loading animations",
          "Optimize animations for performance",
        ],
      },
      {
        id: "final-project",
        title: "Final Project",
        description: "Combine all CSS skills in a complete project",
        content:
          "Apply everything you've learned to create a fully styled, responsive website. Focus on clean code, performance, and user experience.",
        assignment: "Build a complete responsive website showcasing all CSS techniques.",
        tasks: [
          "Plan and design your website layout",
          "Implement responsive design patterns",
          "Add interactive elements and animations",
          "Optimize for performance and accessibility",
        ],
      },
    ],
  },
  {
    id: "javascript",
    title: "JavaScript",
    description:
      "Add interactivity to your websites with JavaScript. Learn programming fundamentals and DOM manipulation.",
    icon: "⚡",
    sessions: [
      {
        id: "what-is-javascript",
        title: "What is JavaScript?",
        description: "Introduction to JavaScript and its role in web development",
        content:
          "JavaScript is a programming language that adds interactivity to websites. Learn how JavaScript differs from HTML and CSS, and its role in modern web development.",
        assignment: "Write your first JavaScript program and connect it to an HTML page.",
        tasks: [
          "Set up JavaScript in an HTML document",
          "Use console.log to output messages",
          "Understand the browser console",
          "Write comments in JavaScript",
        ],
      },
      {
        id: "operators",
        title: "Operators (Arithmetic, Comparison, Logical)",
        description: "JavaScript operators for calculations and comparisons",
        content:
          "Master JavaScript operators including arithmetic (+, -, *, /), comparison (==, ===, !=, <, >), and logical (&&, ||, !) operators.",
        assignment: "Create a simple calculator using JavaScript operators.",
        tasks: [
          "Perform arithmetic calculations",
          "Compare values and understand equality",
          "Use logical operators for conditions",
          "Build a basic calculator interface",
        ],
      },
      {
        id: "variables-data-types",
        title: "Variables, Data Types",
        description: "Storing and working with different types of data",
        content:
          "Learn about JavaScript variables (let, const, var) and data types (string, number, boolean, null, undefined, object, array).",
        assignment: "Create a personal information storage system using different data types.",
        tasks: [
          "Declare variables with let and const",
          "Work with strings, numbers, and booleans",
          "Understand null and undefined",
          "Create and manipulate objects and arrays",
        ],
      },
      {
        id: "conditions-loops",
        title: "Conditions, Loops",
        description: "Control flow with if statements and loops",
        content:
          "Master conditional statements (if, else if, else, switch) and loops (for, while, do-while) to control program flow.",
        assignment: "Build a number guessing game using conditions and loops.",
        tasks: [
          "Write if-else statements",
          "Use switch statements appropriately",
          "Create for and while loops",
          "Build interactive decision-making programs",
        ],
      },
      {
        id: "functions",
        title: "Functions (Declarations, Expressions, Arrow)",
        description: "Creating reusable code with functions",
        content:
          "Learn different ways to create functions in JavaScript: function declarations, function expressions, and arrow functions. Understand scope and parameters.",
        assignment: "Create a utility library with various helper functions.",
        tasks: [
          "Write function declarations and expressions",
          "Use arrow functions appropriately",
          "Understand function scope and parameters",
          "Create functions that return values",
        ],
      },
      {
        id: "arrays-methods",
        title: "Arrays & Methods",
        description: "Working with arrays and their built-in methods",
        content:
          "Master JavaScript arrays and their methods including push, pop, shift, unshift, slice, splice, indexOf, and includes.",
        assignment: "Build a todo list application using array methods.",
        tasks: [
          "Create and manipulate arrays",
          "Use array methods to add/remove items",
          "Search and filter array contents",
          "Build a functional todo list",
        ],
      },
      {
        id: "objects",
        title: "Objects",
        description: "Creating and working with JavaScript objects",
        content:
          "Learn about JavaScript objects, properties, methods, and object-oriented programming concepts. Understand this keyword and object manipulation.",
        assignment: "Create a student management system using objects.",
        tasks: [
          "Create objects with properties and methods",
          "Access and modify object properties",
          "Understand the this keyword",
          "Build a data management system",
        ],
      },
      {
        id: "dom-manipulation",
        title: "DOM Manipulation",
        description: "Interacting with HTML elements using JavaScript",
        content:
          "Learn to select, modify, and create HTML elements using JavaScript. Master the Document Object Model (DOM) and dynamic content creation.",
        assignment: "Build an interactive webpage that responds to user actions.",
        tasks: [
          "Select elements using various methods",
          "Modify element content and attributes",
          "Create new elements dynamically",
          "Style elements with JavaScript",
        ],
      },
      {
        id: "events",
        title: "Events",
        description: "Handling user interactions and browser events",
        content:
          "Master JavaScript event handling including click, submit, load, and keyboard events. Learn event listeners and event object properties.",
        assignment: "Create an interactive form with real-time validation.",
        tasks: [
          "Add event listeners to elements",
          "Handle different types of events",
          "Use the event object effectively",
          "Create responsive user interfaces",
        ],
      },
      {
        id: "string-number-methods",
        title: "String & Number methods",
        description: "Built-in methods for manipulating strings and numbers",
        content:
          "Explore JavaScript string methods (slice, substring, replace, split) and number methods (parseInt, parseFloat, toFixed, Math object).",
        assignment: "Build a text processing tool with string and number manipulation.",
        tasks: [
          "Manipulate strings with built-in methods",
          "Format and process numbers",
          "Use Math object for calculations",
          "Create text analysis tools",
        ],
      },
      {
        id: "advanced-array-methods",
        title: "Advanced Array methods (map, filter, reduce)",
        description: "Functional programming with advanced array methods",
        content:
          "Master advanced array methods including map, filter, reduce, forEach, find, and some. Learn functional programming concepts.",
        assignment: "Create a data analysis dashboard using advanced array methods.",
        tasks: [
          "Transform data with map method",
          "Filter arrays based on conditions",
          "Reduce arrays to single values",
          "Chain array methods effectively",
        ],
      },
      {
        id: "final-practical-project",
        title: "Final Practical Project",
        description: "Build a complete interactive web application",
        content:
          "Combine all JavaScript skills to create a fully functional web application. Focus on clean code, user experience, and best practices.",
        assignment: "Build a complete web application of your choice using all JavaScript concepts.",
        tasks: [
          "Plan and design your application",
          "Implement all JavaScript features learned",
          "Add error handling and validation",
          "Test and optimize your application",
        ],
      },
    ],
  },
  {
    id: "mechanics",
    title: "الميكانيكا",
    description: "تعلم أساسيات الميكانيكا الكلاسيكية. اتقن قوانين نيوتن، الحركة، والقوى في الفيزياء.",
    icon: "⚙️",
    sessions: [
      {
        id: "what-is-mechanics",
        title: "ما هي الميكانيكا؟",
        description: "مقدمة في الميكانيكا ودورها في الفيزياء",
        content:
          "الميكانيكا هي فرع من الفيزياء يدرس حركة الأجسام والقوى المؤثرة عليها. تشمل الميكانيكا الكلاسيكية دراسة الحركة الخطية والدورانية.",
        assignment: "احسب السرعة والتسارع لجسم يتحرك في خط مستقيم باستخدام المعادلات الأساسية.",
        tasks: [
          "فهم مفاهيم المسافة والإزاحة",
          "حساب السرعة المتوسطة والسرعة اللحظية",
          "تطبيق معادلات الحركة الخطية",
          "رسم منحنيات الموضع والسرعة والتسارع",
        ],
      },
      {
        id: "newton-laws",
        title: "قوانين نيوتن للحركة",
        description: "فهم قوانين نيوتن الثلاثة وتطبيقاتها",
        content:
          "قوانين نيوتن الثلاثة هي أساس الميكانيكا الكلاسيكية. القانون الأول (قانون القصور الذاتي)، القانون الثاني (F=ma)، والقانون الثالث (لكل فعل رد فعل مساوٍ له في المقدار ومضاد له في الاتجاه).",
        assignment: "حل مسائل متنوعة على قوانين نيوتن الثلاثة.",
        tasks: [
          "تطبيق القانون الأول في حالات مختلفة",
          "استخدام القانون الثاني لحساب القوة والتسارع",
          "فهم القانون الثالث من خلال أمثلة عملية",
          "حل مسائل مركبة تتضمن عدة قوى",
        ],
      },
      {
        id: "forces-equilibrium",
        title: "القوى والاتزان",
        description: "دراسة أنواع القوى وشروط الاتزان",
        content:
          "تعلم أنواع القوى المختلفة مثل قوة الجاذبية، القوة العمودية، قوة الاحتكاك، وقوة الشد. فهم شروط الاتزان الانتقالي والدوراني.",
        assignment: "حلل القوى المؤثرة على جسم في حالة اتزان.",
        tasks: [
          "رسم مخططات الجسم الحر",
          "حساب محصلة القوى في اتجاهات مختلفة",
          "تطبيق شروط الاتزان الانتقالي",
          "دراسة الاتزان الدوراني والعزوم",
        ],
      },
      {
        id: "energy-work",
        title: "الطاقة والشغل",
        description: "مفاهيم الطاقة الحركية والكامنة والشغل",
        content:
          "الشغل هو الطاقة المنقولة إلى جسم أو منه عن طريق تطبيق قوة. الطاقة الحركية مرتبطة بحركة الجسم، بينما الطاقة الكامنة مرتبطة بموضعه.",
        assignment: "احسب الشغل والطاقة في مسائل مختلفة.",
        tasks: [
          "حساب الشغل المبذول بواسطة قوة ثابتة",
          "تطبيق نظرية الشغل-الطاقة الحركية",
          "دراسة الطاقة الكامنة الجاذبية والمرونية",
          "تطبيق قانون حفظ الطاقة الميكانيكية",
        ],
      },
      {
        id: "momentum-collisions",
        title: "الزخم والتصادمات",
        description: "قانون حفظ الزخم وأنواع التصادمات",
        content: "الزخم هو حاصل ضرب الكتلة في السرعة. قانون حفظ الزخم ينص على أن الزخم الكلي لنظام معزول يبقى ثابتاً.",
        assignment: "حلل تصادمات مختلفة باستخدام قانون حفظ الزخم.",
        tasks: [
          "حساب الزخم للأجسام المتحركة",
          "تطبيق قانون حفظ الزخم في التصادمات",
          "التمييز بين التصادمات المرنة وغير المرنة",
          "حل مسائل التصادمات في بعد واحد وبعدين",
        ],
      },
      {
        id: "circular-motion",
        title: "الحركة الدائرية",
        description: "دراسة الحركة الدائرية والقوة المركزية",
        content:
          "الحركة الدائرية تتطلب قوة مركزية موجهة نحو مركز الدائرة. السرعة الزاوية والتسارع المركزي هما مفاهيم أساسية في هذا النوع من الحركة.",
        assignment: "احسب القوة المركزية والسرعة الزاوية لأجسام في حركة دائرية.",
        tasks: [
          "حساب السرعة الزاوية والخطية",
          "تطبيق معادلات التسارع المركزي",
          "حساب القوة المركزية المطلوبة",
          "دراسة الحركة الدائرية المنتظمة وغير المنتظمة",
        ],
      },
    ],
  },
  {
    id: "electricity",
    title: "الكهرباء",
    description: "اكتشف عالم الكهرباء والمغناطيسية. تعلم الدوائر الكهربائية وقوانين الكهرباء.",
    icon: "⚡",
    sessions: [
      {
        id: "electric-charge",
        title: "الشحنة الكهربائية وقانون كولوم",
        description: "مقدمة في الشحنة الكهربائية والقوى الكهروستاتيكية",
        content:
          "الشحنة الكهربائية خاصية أساسية للمادة. قانون كولوم يصف القوة بين الشحنات الكهربائية. القوة تتناسب طردياً مع حاصل ضرب الشحنات وعكسياً مع مربع المسافة بينهما.",
        assignment: "احسب القوة الكهروستاتيكية بين شحنات مختلفة.",
        tasks: [
          "فهم مفهوم الشحنة الكهربائية الموجبة والسالبة",
          "تطبيق قانون كولوم في حالات مختلفة",
          "حساب القوة المحصلة لعدة شحنات",
          "دراسة مبدأ التراكب للقوى الكهربائية",
        ],
      },
      {
        id: "electric-field",
        title: "المجال الكهربائي",
        description: "فهم مفهوم المجال الكهربائي وخطوط المجال",
        content:
          "المجال الكهربائي هو المنطقة المحيطة بالشحنة الكهربائية حيث تؤثر قوة كهربائية على شحنات أخرى. شدة المجال تقاس بالنيوتن لكل كولوم.",
        assignment: "ارسم خطوط المجال الكهربائي لتوزيعات شحنات مختلفة.",
        tasks: [
          "حساب شدة المجال الكهربائي",
          "رسم خطوط المجال لشحنة نقطية",
          "دراسة المجال الكهربائي المنتظم",
          "تطبيق مبدأ التراكب للمجالات الكهربائية",
        ],
      },
      {
        id: "electric-potential",
        title: "الجهد الكهربائي",
        description: "مفهوم الجهد الكهربائي والطاقة الكامنة الكهربائية",
        content: "الجهد الكهربائي هو الطاقة الكامنة الكهربائية لكل وحدة شحنة. الفولت هو وحدة قياس الجهد الكهربائي.",
        assignment: "احسب الجهد الكهربائي والطاقة الكامنة في مسائل مختلفة.",
        tasks: [
          "حساب الجهد الكهربائي لشحنة نقطية",
          "فهم العلاقة بين الجهد والمجال الكهربائي",
          "حساب الطاقة الكامنة الكهربائية",
          "دراسة الأسطح متساوية الجهد",
        ],
      },
      {
        id: "electric-current",
        title: "التيار الكهربائي وقانون أوم",
        description: "دراسة التيار الكهربائي والمقاومة",
        content:
          "التيار الكهربائي هو معدل تدفق الشحنة الكهربائية. قانون أوم ينص على أن التيار يتناسب طردياً مع الجهد وعكسياً مع المقاومة (V=IR).",
        assignment: "طبق قانون أوم في دوائر كهربائية بسيطة.",
        tasks: [
          "حساب التيار الكهربائي في موصل",
          "تطبيق قانون أوم في مسائل مختلفة",
          "فهم مفهوم المقاومة الكهربائية",
          "دراسة العوامل المؤثرة على المقاومة",
        ],
      },
      {
        id: "dc-circuits",
        title: "دوائر التيار المستمر",
        description: "تحليل الدوائر الكهربائية البسيطة والمعقدة",
        content:
          "دوائر التيار المستمر تحتوي على مصادر جهد ومقاومات موصولة على التوالي أو التوازي. قوانين كيرشوف تساعد في تحليل الدوائر المعقدة.",
        assignment: "حلل دوائر كهربائية مختلفة باستخدام قوانين كيرشوف.",
        tasks: [
          "حساب المقاومة المكافئة للتوصيل على التوالي والتوازي",
          "تطبيق قانون كيرشوف للجهد",
          "تطبيق قانون كيرشوف للتيار",
          "حساب القدرة الكهربائية في الدوائر",
        ],
      },
      {
        id: "magnetism",
        title: "المغناطيسية والقوة المغناطيسية",
        description: "دراسة المجال المغناطيسي والقوة على الشحنات المتحركة",
        content:
          "المجال المغناطيسي يؤثر بقوة على الشحنات المتحركة والتيارات الكهربائية. القوة المغناطيسية تعطى بالعلاقة F = qvB sin θ.",
        assignment: "احسب القوة المغناطيسية على شحنات متحركة وتيارات كهربائية.",
        tasks: [
          "فهم مفهوم المجال المغناطيسي",
          "حساب القوة المغناطيسية على شحنة متحركة",
          "دراسة القوة على موصل يحمل تياراً",
          "تطبيق قاعدة اليد اليمنى",
        ],
      },
    ],
  },
  {
    id: "optics",
    title: "البصريات",
    description: "استكشف عالم الضوء والبصريات. تعلم انكسار وانعكاس الضوء والعدسات والمرايا.",
    icon: "🔍",
    sessions: [
      {
        id: "nature-of-light",
        title: "طبيعة الضوء",
        description: "مقدمة في طبيعة الضوء وخصائصه الموجية والجسيمية",
        content:
          "الضوء له طبيعة مزدوجة - موجية وجسيمية. سرعة الضوء في الفراغ ثابتة وتساوي 3×10⁸ م/ث. الضوء موجة كهرومغناطيسية.",
        assignment: "احسب تردد وطول موجة أنواع مختلفة من الضوء.",
        tasks: [
          "فهم العلاقة بين التردد والطول الموجي",
          "حساب طاقة الفوتونات",
          "دراسة الطيف الكهرومغناطيسي",
          "فهم مفهوم الازدواجية موجة-جسيم",
        ],
      },
      {
        id: "reflection",
        title: "انعكاس الضوء",
        description: "قوانين انعكاس الضوء والمرايا",
        content:
          "قانون انعكاس الضوء: زاوية السقوط تساوي زاوية الانعكاس، والشعاع الساقط والمنعكس والعمود على السطح في مستوى واحد.",
        assignment: "حلل انعكاس الضوء في المرايا المستوية والكروية.",
        tasks: [
          "تطبيق قوانين الانعكاس",
          "رسم مسار الأشعة في المرايا المستوية",
          "دراسة المرايا الكروية المقعرة والمحدبة",
          "حساب موضع وحجم الصور المتكونة",
        ],
      },
      {
        id: "refraction",
        title: "انكسار الضوء",
        description: "قانون سنيل وظاهرة انكسار الضوء",
        content:
          "عندما ينتقل الضوء من وسط إلى آخر، ينكسر حسب قانون سنيل: n₁sin θ₁ = n₂sin θ₂، حيث n هو معامل الانكسار.",
        assignment: "طبق قانون سنيل في مسائل انكسار مختلفة.",
        tasks: [
          "حساب زاوية الانكسار باستخدام قانون سنيل",
          "فهم مفهوم معامل الانكسار",
          "دراسة الانعكاس الكلي الداخلي",
          "تطبيقات الانكسار في الحياة العملية",
        ],
      },
      {
        id: "lenses",
        title: "العدسات",
        description: "أنواع العدسات وتكوين الصور",
        content:
          "العدسات نوعان: محدبة (مجمعة) ومقعرة (مفرقة). معادلة العدسة الرقيقة: 1/f = 1/do + 1/di، حيث f البعد البؤري.",
        assignment: "احسب موضع وخصائص الصور المتكونة بالعدسات.",
        tasks: [
          "التمييز بين العدسات المحدبة والمقعرة",
          "رسم مسار الأشعة في العدسات",
          "تطبيق معادلة العدسة الرقيقة",
          "حساب التكبير في العدسات",
        ],
      },
      {
        id: "wave-optics",
        title: "البصريات الموجية",
        description: "التداخل والحيود في الضوء",
        content: "الضوء يظهر خصائص موجية مثل التداخل والحيود. تجربة الشق المزدوج ليونغ تثبت الطبيعة الموجية للضوء.",
        assignment: "احسب أنماط التداخل في تجارب مختلفة.",
        tasks: [
          "فهم مفهوم التداخل البناء والهدام",
          "تحليل تجربة الشق المزدوج",
          "دراسة ظاهرة الحيود",
          "حساب المسافة بين الهدب في أنماط التداخل",
        ],
      },
      {
        id: "optical-instruments",
        title: "الأجهزة البصرية",
        description: "المجهر والتلسكوب والأجهزة البصرية الأخرى",
        content:
          "الأجهزة البصرية تستخدم العدسات والمرايا لتكبير الصور أو تجميع الضوء. المجهر يكبر الأجسام الصغيرة، والتلسكوب يقرب الأجسام البعيدة.",
        assignment: "احسب قوة التكبير للمجهر والتلسكوب.",
        tasks: [
          "فهم مبدأ عمل المجهر المركب",
          "دراسة أنواع التلسكوبات",
          "حساب قوة التكبير الزاوي",
          "تطبيقات الأجهزة البصرية في الحياة",
        ],
      },
    ],
  },
]

export const projectCategories: ProjectCategory[] = [
  {
    id: "html-css",
    title: "HTML & CSS Projects",
    description:
      "Build beautiful, responsive websites using HTML and CSS. Perfect for practicing layout and styling skills.",
    icon: "🎨",
    projects: [
      {
        id: "personal-portfolio",
        title: "Personal Portfolio Website",
        description: "Create a professional portfolio website to showcase your skills and projects.",
        difficulty: "Intermediate",
        technologies: ["HTML5", "CSS3", "Flexbox", "Grid"],
        requirements: [
          "Responsive design that works on all devices",
          "Navigation menu with smooth scrolling",
          "Hero section with your photo and introduction",
          "Skills section with progress bars",
          "Projects gallery with hover effects",
          "Contact form with validation styling",
          "Footer with social media links",
        ],
        instructions:
          "Start by creating the HTML structure with semantic elements. Use CSS Grid for the main layout and Flexbox for components. Implement a mobile-first responsive design approach. Add smooth animations and transitions for better user experience.",
        estimatedTime: "8-12 hours",
      },
      {
        id: "restaurant-website",
        title: "Restaurant Landing Page",
        description: "Design an elegant restaurant website with menu, gallery, and reservation section.",
        difficulty: "Beginner",
        technologies: ["HTML5", "CSS3", "CSS Animations"],
        requirements: [
          "Header with logo and navigation",
          "Hero section with restaurant image",
          "About section with restaurant story",
          "Menu section with food items and prices",
          "Image gallery of dishes",
          "Contact information and location",
          "Reservation form",
        ],
        instructions:
          "Focus on creating an appetizing visual design with warm colors and food imagery. Use CSS animations for menu items and image hover effects. Ensure the design is mobile-friendly.",
        estimatedTime: "6-8 hours",
      },
      {
        id: "blog-layout",
        title: "Modern Blog Layout",
        description: "Create a clean, modern blog layout with article cards and sidebar.",
        difficulty: "Intermediate",
        technologies: ["HTML5", "CSS3", "CSS Grid", "Flexbox"],
        requirements: [
          "Header with blog title and navigation",
          "Main content area with article cards",
          "Sidebar with categories and recent posts",
          "Article preview with image, title, and excerpt",
          "Pagination controls",
          "Search functionality styling",
          "Footer with links and copyright",
        ],
        instructions:
          "Use CSS Grid for the main layout structure. Create reusable card components for articles. Implement a clean typography system and consistent spacing throughout.",
        estimatedTime: "10-14 hours",
      },
    ],
  },
  {
    id: "fullstack",
    title: "Full-Stack Projects",
    description: "Complete web applications using HTML, CSS, and JavaScript. Build interactive, dynamic websites.",
    icon: "⚡",
    projects: [
      {
        id: "todo-app",
        title: "Advanced Todo Application",
        description: "Build a feature-rich todo app with local storage, categories, and filtering.",
        difficulty: "Intermediate",
        technologies: ["HTML5", "CSS3", "JavaScript", "Local Storage"],
        requirements: [
          "Add, edit, and delete tasks",
          "Mark tasks as complete/incomplete",
          "Filter tasks by status (all, active, completed)",
          "Search functionality",
          "Task categories and priority levels",
          "Data persistence with localStorage",
          "Drag and drop to reorder tasks",
          "Export tasks to JSON",
        ],
        instructions:
          "Start with the HTML structure for the todo interface. Style with CSS for a modern look. Implement JavaScript functionality for CRUD operations. Use localStorage to persist data between sessions. Add advanced features like drag-and-drop and filtering.",
        estimatedTime: "15-20 hours",
      },
      {
        id: "weather-app",
        title: "Weather Dashboard",
        description: "Create a weather application that fetches real-time weather data and displays forecasts.",
        difficulty: "Advanced",
        technologies: ["HTML5", "CSS3", "JavaScript", "APIs", "Geolocation"],
        requirements: [
          "Current weather display with location",
          "5-day weather forecast",
          "Search for weather by city name",
          "Geolocation support for current location",
          "Weather icons and animations",
          "Temperature unit conversion (C/F)",
          "Favorite cities list",
          "Responsive design for mobile",
        ],
        instructions:
          "Use a weather API (like OpenWeatherMap) to fetch data. Implement geolocation API for current location. Create dynamic UI that updates based on weather data. Add smooth animations and transitions for better UX.",
        estimatedTime: "20-25 hours",
      },
      {
        id: "expense-tracker",
        title: "Personal Expense Tracker",
        description: "Build a comprehensive expense tracking application with charts and analytics.",
        difficulty: "Advanced",
        technologies: ["HTML5", "CSS3", "JavaScript", "Chart.js", "Local Storage"],
        requirements: [
          "Add income and expense transactions",
          "Categorize transactions",
          "Visual charts for spending analysis",
          "Monthly/yearly spending reports",
          "Budget setting and tracking",
          "Transaction search and filtering",
          "Data export functionality",
          "Dark/light theme toggle",
        ],
        instructions:
          "Design a clean dashboard interface. Implement transaction management with JavaScript. Use Chart.js for data visualization. Create a robust data structure for storing financial data. Add budget alerts and spending insights.",
        estimatedTime: "25-30 hours",
      },
      {
        id: "quiz-app",
        title: "Interactive Quiz Application",
        description: "Develop a quiz app with multiple question types, scoring, and progress tracking.",
        difficulty: "Intermediate",
        technologies: ["HTML5", "CSS3", "JavaScript", "JSON"],
        requirements: [
          "Multiple choice questions",
          "True/false questions",
          "Timer for each question",
          "Score calculation and display",
          "Progress indicator",
          "Question categories",
          "High score leaderboard",
          "Quiz results summary",
        ],
        instructions:
          "Create a question data structure in JSON format. Build a dynamic question display system. Implement timer functionality and score tracking. Add smooth transitions between questions and engaging animations.",
        estimatedTime: "18-22 hours",
      },
    ],
  },
  {
    id: "mechanics-projects",
    title: "مشاريع الميكانيكا",
    description: "بناء محاكيات وحاسبات للمفاهيم الميكانيكية. مثالية لممارسة قوانين الحركة والقوى.",
    icon: "⚙️",
    projects: [
      {
        id: "projectile-simulator",
        title: "محاكي حركة المقذوفات",
        description: "إنشاء محاكي تفاعلي لحركة المقذوفات مع رسوم بيانية للمسار.",
        difficulty: "Intermediate",
        technologies: ["HTML5", "CSS3", "JavaScript", "Canvas API"],
        requirements: [
          "واجهة لإدخال السرعة الابتدائية والزاوية",
          "رسم مسار المقذوف بصرياً",
          "حساب المدى الأقصى والارتفاع الأقصى",
          "عرض الرسوم البيانية للسرعة والموضع",
          "إمكانية تغيير قيمة تسارع الجاذبية",
          "عرض القيم اللحظية أثناء الحركة",
          "حفظ ومقارنة مسارات مختلفة",
        ],
        instructions:
          "ابدأ بإنشاء واجهة HTML للمدخلات. استخدم Canvas API لرسم المسار. طبق معادلات الحركة في بعدين باستخدام JavaScript. أضف رسوم بيانية تفاعلية للبيانات.",
        estimatedTime: "12-16 ساعة",
      },
      {
        id: "forces-calculator",
        title: "حاسبة القوى والاتزان",
        description: "تطوير حاسبة لتحليل القوى وحالات الاتزان مع مخططات الجسم الحر.",
        difficulty: "Beginner",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        requirements: [
          "إدخال عدة قوى بمقاديرها واتجاهاتها",
          "حساب محصلة القوى",
          "رسم مخطط الجسم الحر",
          "تحديد حالة الاتزان",
          "عرض مكونات القوى في الاتجاهات المختلفة",
          "حساب العزوم والاتزان الدوراني",
          "أمثلة تطبيقية متنوعة",
        ],
        instructions:
          "صمم واجهة بسيطة لإدخال القوى. استخدم الرياضيات لحساب المحصلة. أضف رسوم بصرية لتوضيح القوى والاتجاهات.",
        estimatedTime: "8-10 ساعات",
      },
      {
        id: "energy-conservation",
        title: "محاكي حفظ الطاقة",
        description: "بناء محاكي لإظهار تحولات الطاقة وقانون حفظ الطاقة.",
        difficulty: "Advanced",
        technologies: ["HTML5", "CSS3", "JavaScript", "Physics Engine"],
        requirements: [
          "محاكاة حركة البندول البسيط",
          "عرض تحولات الطاقة الحركية والكامنة",
          "رسوم بيانية للطاقة مع الزمن",
          "محاكاة الحركة على مسارات مختلفة",
          "تأثير الاحتكاك على الطاقة",
          "حساب الكفاءة الميكانيكية",
          "أمثلة متعددة (نابض، منحدر، إلخ)",
        ],
        instructions:
          "استخدم محرك فيزياء بسيط أو اكتب المعادلات بنفسك. أضف رسوم بيانية تفاعلية. اجعل المحاكاة قابلة للتخصيص مع معاملات مختلفة.",
        estimatedTime: "20-25 ساعة",
      },
    ],
  },
  {
    id: "electricity-projects",
    title: "مشاريع الكهرباء",
    description: "تطبيقات تفاعلية لمفاهيم الكهرباء والمغناطيسية. بناء محاكيات للدوائر الكهربائية.",
    icon: "⚡",
    projects: [
      {
        id: "circuit-simulator",
        title: "محاكي الدوائر الكهربائية",
        description: "بناء محاكي تفاعلي للدوائر الكهربائية مع إمكانية السحب والإفلات.",
        difficulty: "Advanced",
        technologies: ["HTML5", "CSS3", "JavaScript", "SVG", "Drag & Drop API"],
        requirements: [
          "مكتبة مكونات كهربائية (مقاومات، بطاريات، مصابيح)",
          "واجهة سحب وإفلات لبناء الدوائر",
          "حساب التيار والجهد في كل جزء",
          "عرض القيم على المكونات",
          "محاكاة إضاءة المصابيح حسب التيار",
          "حفظ وتحميل تصميمات الدوائر",
          "أدوات قياس افتراضية (فولتميتر، أميتر)",
        ],
        instructions:
          "ابدأ بتصميم المكونات باستخدام SVG. طبق قوانين كيرشوف لحساب القيم. أضف واجهة سحب وإفلات سهلة الاستخدام. اجعل المحاكاة واقعية قدر الإمكان.",
        estimatedTime: "25-30 ساعة",
      },
      {
        id: "ohms-law-calculator",
        title: "حاسبة قانون أوم",
        description: "تطوير حاسبة شاملة لقانون أوم والقدرة الكهربائية.",
        difficulty: "Beginner",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        requirements: [
          "حساب الجهد والتيار والمقاومة",
          "حساب القدرة الكهربائية",
          "رسوم بيانية للعلاقات",
          "أمثلة تطبيقية متنوعة",
          "تحويل الوحدات المختلفة",
          "عرض الصيغ المستخدمة",
          "واجهة سهلة الاستخدام",
        ],
        instructions:
          "صمم واجهة بسيطة مع حقول الإدخال. طبق معادلات قانون أوم والقدرة. أضف رسوم بيانية لتوضيح العلاقات بين المتغيرات.",
        estimatedTime: "6-8 ساعات",
      },
      {
        id: "electromagnetic-field",
        title: "مصور المجالات الكهرومغناطيسية",
        description: "إنشاء أداة لرسم وتصور المجالات الكهربائية والمغناطيسية.",
        difficulty: "Advanced",
        technologies: ["HTML5", "CSS3", "JavaScript", "Canvas API", "WebGL"],
        requirements: [
          "رسم خطوط المجال الكهربائي للشحنات النقطية",
          "تصور المجال المغناطيسي حول المغناطيس",
          "محاكاة حركة الشحنات في المجالات",
          "رسم ثلاثي الأبعاد للمجالات",
          "إمكانية إضافة عدة مصادر للمجال",
          "حساب شدة المجال في نقاط مختلفة",
          "رسوم متحركة لتوضيح المفاهيم",
        ],
        instructions:
          "استخدم Canvas أو WebGL للرسوم المعقدة. طبق معادلات المجال الكهربائي والمغناطيسي. أضف تفاعلية للمستخدم لتغيير المعاملات.",
        estimatedTime: "30-35 ساعة",
      },
    ],
  },
]
