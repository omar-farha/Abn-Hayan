import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function TeacherSection() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Use intersection observer to trigger animations when in view
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="bg-background py-24 relative overflow-hidden">
      <div className="absolute inset-0 ">
        <motion.img
          src="/magnetic.png"
          alt="atom"
          className="absolute top-8 left-12 w-24 h-24 text-blue-300/30"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.img
          src="/science.png"
          alt="atom"
          className="absolute bottom-8 right-12 w-32 h-32 text-cyan-400/30 -z-10"
          variants={floatingVariants}
          animate="animate"
        />
        <svg
          className="absolute top-1/2 left-0 w-[500px] h-16 text-blue-400"
          viewBox="0 0 520 64"
          fill="none"
        >
          <path
            d="M0 32 C 40 0, 80 64, 120 32 S 200 0, 240 32 320 64, 360 32 440 0, 480 32 520 64, 560 32"
            className="stroke-current"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
      >
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div className="order-1 lg:order-2" variants={itemVariants}>
            <div className="relative group">
              <div className="relative w-96 h-96 mx-auto px-5 md:px-0">
                {/* Glowing background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[60px] blur-2xl group-hover:blur-3xl transition-all duration-500"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />

                {/* Main image container */}
                <motion.div
                  className="relative z-10 w-full h-full rounded-[60px] overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-500 shadow-2xl bg-white"
                  variants={imageVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src="/profile.png"
                    alt="صورة المعلم سامح حيان"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent"></div>
                </motion.div>

                {/* Floating physics elements */}
                {/* <motion.div
                  className="absolute -top-6 -right-6 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-300 z-50"
                  variants={floatingVariants}
                  animate="animate"
                >
                  <span className="text-2xl">⚡</span>
                </motion.div>
                <motion.div
                  className="absolute -bottom-6 -left-6 w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center border border-secondary/20 group-hover:scale-110 transition-transform duration-300"
                  variants={floatingVariants}
                  animate="animate"
                  transition={{ delay: 1 }}
                >
                  <span className="text-3xl">🔬</span>
                </motion.div> */}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="order-2 lg:order-1"
            variants={containerVariants}
          >
            <motion.div className="mb-8" variants={itemVariants}>
              <motion.span
                className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.2,
                }}
              >
                🎓 معلم متميز
              </motion.span>

              <motion.div
                className="flex items-center gap-4 mb-8 mt-3"
                variants={itemVariants}
              >
                <h2
                  className="text-5xl md:text-6xl  font-oi text-blue-400 
 "
                >
                  سامح حيان
                </h2>
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                    <path
                      d="M12 1v6m0 8v6m11-7h-6m-8 0H1"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="space-y-6 text-muted-foreground leading-relaxed mb-10"
              variants={containerVariants}
            >
              <motion.p
                className="text-xl md:text-2xl font-medium font-bold"
                variants={itemVariants}
              >
                <span className="text-primary">خبرة تعليمية استثنائية</span> في
                تبسيط مفاهيم الفيزياء المعقدة
              </motion.p>
              <motion.p className="text-lg" variants={itemVariants}>
                لأن طلبة كتير بتواجه صعوبة في فهم الفيزياء وحل المسائل، وفرتلك
                في منصة ابن حيان كل الي نفسك فيه عشان اخليلك المادة بسيطة
                ومُمتعة
              </motion.p>

              {/* Achievement highlights */}
              <motion.div
                className="grid grid-cols-2 gap-4 mt-8"
                variants={containerVariants}
              >
                <motion.div
                  className="bg-card/50 rounded-xl p-4 border border-border z-50"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="text-2xl font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">سنة خبرة</div>
                </motion.div>
                <motion.div
                  className="bg-card/50 rounded-xl p-4 border border-border"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="text-2xl font-bold text-secondary">98%</div>
                  <div className="text-sm text-muted-foreground">نسبة نجاح</div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={containerVariants}
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-bold py-4 px-8 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group w-full">
                  <span className="flex items-center gap-2">
                    سجل وجرب مجاناً
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 bg-transparent w-full"
                >
                  شاهد الفيديو التعريفي
                </Button>
              </motion.div>
            </motion.div> */}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
