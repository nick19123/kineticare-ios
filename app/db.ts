export const initialPlans = {
  1: {
    id: 1,
    pName: "Kineticare Example Plan",
    pInfo: "This is an example exercise plan to test the Kineticare app with.",
    exercises: [
      {
        image: require('./assets/images/Exercise.jpg'),
        title: "1. Plank",
        description: "Lie face down, lift your body on your elbows and toes, keep a straight spine, ensure your hips and pelvis stay level, and maintain a neutral pelvic position throughout.",
        reps: "3",
        hold: "30 seconds",
        complete: "2 sets",
        perform: "1 / day",
        link: "https://example.com/"
      },
      {
        image: require('./assets/images/Bridge.jpg'),
        title: "2. Bridge",
        description: "Lie on your back with knees bent, tighten your lower abs, squeeze your buttocks, lift your hips to form a bridge with knees over ankles, hold briefly, then lower and repeat.",
        reps: "2",
        hold: "30 seconds",
        complete: "1",
        perform: "1 times/day",
        link: null
      }
    ]
  },
  2: {
    id: 2,
    pName: "New Plan with Empty Exercises",
    pInfo: "This is a new plan with 8 empty exercises.",
    exercises: [
      {
        image: 'https://via.placeholder.com/256',
        title: '',
        description: '',
        reps: '',
        hold: '',
        complete: '',
        perform: '',
        link: null
      },
      {
        image: 'https://via.placeholder.com/256',
        title: '',
        description: '',
        reps: '',
        hold: '',
        complete: '',
        perform: '',
        link: null
      },
      {
        image: 'https://via.placeholder.com/256',
        title: '',
        description: '',
        reps: '',
        hold: '',
        complete: '',
        perform: '',
        link: null
      },
      {
        image: 'https://via.placeholder.com/256',
        title: '',
        description: '',
        reps: '',
        hold: '',
        complete: '',
        perform: '',
        link: null
      },
      {
        image: 'https://via.placeholder.com/256',
        title: '',
        description: '',
        reps: '',
        hold: '',
        complete: '',
        perform: '',
        link: null
      },
      {
        image: 'https://via.placeholder.com/256',
        title: '',
        description: '',
        reps: '',
        hold: '',
        complete: '',
        perform: '',
        link: null
      },
      {
        image: 'https://via.placeholder.com/256',
        title: '',
        description: '',
        reps: '',
        hold: '',
        complete: '',
        perform: '',
        link: null
      },
      {
        image: 'https://via.placeholder.com/256',
        title: '',
        description: '',
        reps: '',
        hold: '',
        complete: '',
        perform: '',
        link: null
      }
    ]
  }
};

export default initialPlans; 