import { gql } from 'apollo-server';
import { Context } from './context';
import { getStructures } from './services/structures';

export const typeDefs = gql`
  type CatalogItem {
    _id: ID
    order: String
    structures: [String]
  }

  type Structure {
    _id: ID
    a: String
    b: String
    c: String
    alpha: String
    beta: String
    gamma: String
    vol: String
    z: String
    diffrtemp: String
    diffrpressure: String
    sg: String
    sgHall: String
    title: String
    journal: String
    year: String
    volume: String
    issue: String
    firstpage: String
    lastpage: String
    doi: String
    radType: String
    wavelength: String
    commonname: String
    chemname: String
    mineral: String
    formula: String
    calcformula: String
    iupacformula: String
    Rall: String
    Robs: String
    Rref: String
    wRall: String
    wRobs: String
    wRref: String
  }

  type Query {
    catalogById(id:ID!): CatalogItem
    structureById(id:ID): Structure
    structures(page: Int!): [Structure]
  }
`;

export const resolvers = {
  Query: {
    catalogById: async (_parent: any, {id}: {id: string }, {db}: Context) => {
      return await db.collection('catalog').findOne({_id: parseInt(id, 10), order: "id"});
    },
    structureById: async (_parent: any, {id}: {id: string }, {db}: Context) => {
      return await db.collection('structures').findOne({_id: parseInt(id, 10)});
    },
    structures: async (_parent: any, {page}: { page: string }, {db}: Context) => {
      return await getStructures({page}, {db});
    },
  }
};
