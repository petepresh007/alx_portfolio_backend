import { motion } from "framer-motion";
import { Nav } from "./nav";

const animationsY = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0},
  exit: { opacity: 0, y: -100 },
};

const fadeInRight = {
  initial:{ opacity: 0, x: -150 },
  animate:{ opacity: 1, x: 0 },
  exit:{ opacity: 0, y: 100 },
};

 export const AnimateY = (props) => {
  // Moves component along the y-axis
  return (
    <motion.div
      className="w-full sticky top-2 z-50 "
      variants={animationsY}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: .3 }}
      {...props}
    >
      <Nav/>
    </motion.div>
  );
};

export const FadeInRight = ({ children }) => {
  return(
    <motion.div
    className="w-full"
    variants={fadeInRight}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: .35 }}
    >
      {children}
    </motion.div>
  )
}