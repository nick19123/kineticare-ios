export const initialPlans = {
  1: {
    planName: "Kineticare Example Plan",
    exercises: [
      {
        exerciseImage: require('./assets/images/Exercise.jpg'),
        exerciseID: 1,
        exerciseName: "1. Plank",
        sequenceNum: 1,
        reps: 3,
        sets: 2,
        duration: 30,
        time: 1,
        description: "Lie face down, lift your body on your elbows and toes, keep a straight spine, ensure your hips and pelvis stay level, and maintain a neutral pelvic position throughout.",
      },
      {
        exerciseImage: require('./assets/images/Bridge.jpg'),
        exerciseID: 2,
        exerciseName: "2. Bridge",
        sequenceNum: 2,
        reps: 2,
        sets: 1,
        duration: 30,
        time: 1,
        description: "Lie on your back with knees bent, tighten your lower abs, squeeze your buttocks, lift your hips to form a bridge with knees over ankles, hold briefly, then lower and repeat.",
      }
    ]
  }
};

export default initialPlans; 