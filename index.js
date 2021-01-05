const { ApolloServer, gql, PubSub } = require('apollo-server');

let employees = [
  {
    id: 1,
    name: 'John Smith',
    employerId: 1,
  },
  {
    id: 2,
    name: 'Lauren Armstrong',
    employerId: 1,
  },
  {
    id: 3,
    name: 'Henry Bautista',
    employerId: 1,
  },
  {
    id: 4,
    name: 'Jake Snarl',
    employerId: 2,
  },
];

let employers = [
  {
    id: 1,
    name: 'Harrys pub',
  },
  {
    id: 2,
    name: 'UPS',
  },
];

const pubSub = new PubSub();

const NEW_EMPLOYEE = 'NEW_EMPLYEE';

const typeDefs = gql`

type Query {
  employees: [Employee]
  employers: [Employer]
  employee(id: Int): Employee
  employer(id: Int): Employer
}

type Employer {
  id: Int!
  name: String
  employees: [Employee]
  numEmployees: Int
}

type Employee {
  id: Int
  name: String
  employer: Employer
}

type Mutation {
  addEmployee(name: String!, employerId: Int!): Employee
  removeEmployee(id: Int!): Employee
  changeEmployeeName(name: String!, id: Int!): Employee
  changeEmployer(id: Int!, employerId: Int!): Employee
}

`;

const resolvers = {

  Query: {
    employer: (_, args) => employers.filter(e => e.id === args.id)[0],
    employee: (_, args) => employees.filter(e => e.id === args.id)[0],
    employers: () => employers,
    employees: () => employees,
  },

  Employer: {
    numEmployees: (parentValue) => {
      console.log('parentValue in Employer: ', parentValue);
      return employees.filter(e => e.employerId === parentValue.id).length;
    },
    employees: (parentValue) => {
      return employees.filter(e => e.employerId === parentValue.id);
    },
  },
  
  Employee: {
    employer: (parentValue) => {
      return employers.filter(e => e.id === parentValue.employerId)[0];
    },
  },
  
  Mutation: {
    addEmployee: (_, {name, employerId}) => {
      const newEmployee = {
        id: employees.length + 1,
        name: name,
        employerId: employerId,
      };
      employees.push(newEmployee);
      return newEmployee;
    },
    removeEmployee: (_, {id}) => {
      return employees.filter(e => e.id !== id)
    },
    changeEmployeeName: (_, {name}) => {
      let newEmployee;
      // Change employees
      employees = employees.map(e => {
        if(e.id === args.id) {
          newEmployee = {
            ...e,
            name: name,
          };
          return newEmployee
        };
        return e;
      });
      // Return change employee
      return newEmployee;
    },
    changeEmployer: (_, {employerId}) => {
      let newEmployee;
      // Change employees
      employees = employees.map(e => {
        if(e.id === args.id) {
          newEmployee = {
            ...e,
            employerId: employerId,
          };
          return newEmployee
        };
        return e;
      });
      // Return change employee
      return newEmployee;
    },

  }

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen({port: 4005}).then(({ url }) => {
  console.log(`Server is running on ${url}`)
})