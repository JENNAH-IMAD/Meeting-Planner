import { animated, useSpring } from 'react-spring';

const HomePage = () => {
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <animated.div style={{ ...props, color: 'black', fontSize: '50px' }}>Welcome to Meeting Planner</animated.div>
    </div>
  );
};

export default HomePage;
