const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// GraphQL Schema
const schema = buildSchema(`
	type Query {
		course(id: Int): Course
		courses(topic: String): [Course] 
		coursesWithTitle(title: String): [Course]
	},
	type Mutation {
		updateCourseTopic(id: Int!, topic: String!): Course
		addCourse(input: InputCourse!): [Course]
	},
	input InputCourse {
		id: Int!
		title: String!
		author: String!
		description: String!
		topic: String!
		url: String!
	},
	type Course {
		id: Int
		title: String
		author: String
		description: String
		topic: String
		url: String
	}
`);

// Mocking data instead of using DB
const coursesData = [
  {
    id: 1,
    title: "The Complete Node.js Developer Course",
    author: "Andrew Mead, Rob Percival",
    description:
      "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs/",
  },
  {
    id: 2,
    title: "Node.js, Express & MongoDB Dev to Deployment",
    author: "Brad Traversy",
    description:
      "Learn by example building & deploying real-world Node.js applications from absolute scratch",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs-express-mongodb/",
  },
  {
    id: 3,
    title: "JavaScript: Understanding The Weird Parts",
    author: "Anthony Alicea",
    description:
      "An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.",
    topic: "JavaScript",
    url: "https://codingthesmartway.com/courses/understand-javascript/",
  },
];

const getCourse = (args) => {
  const id = args.id;
  return coursesData.filter((course) => course.id == id)[0];
};

const getCourses = (args) => {
  if (args.topic) {
    const topic = args.topic;
    return coursesData.filter((course) => course.topic === topic);
  } else {
    return coursesData;
  }
};

const getCoursesWithTitle = (args) => {
  if (args.title) {
    const title = args.title;
    return coursesData.filter((course) => course.title.includes(title));
  }
};

const updateCourseTopic = ({ id, topic }) => {
  coursesData.map((course) => {
    if (course.id == id) {
      course.topic = topic;
      return course;
    }
    return coursesData.filter((course) => course.id == id)[0];
  });
};

const addCourse = (course) => {
  coursesData.push(course.input);
  return coursesData;
};

const root = {
  course: getCourse,
  courses: getCourses,
  coursesWithTitle: getCoursesWithTitle,
  updateCourseTopic: updateCourseTopic,
  addCourse: addCourse,
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000, () =>
  console.log("Express GraphQL server is running on port 4000.")
);
