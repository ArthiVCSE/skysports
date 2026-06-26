// app/api/graphql/route.ts
import { ApolloServer } from "apollo-server-micro";
import { type NextApiRequest, type NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongoose";
import { User } from "@/lib/models/User";
import { Product } from "@/lib/models/Product";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_change_me";

// GraphQL schema definition
const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String
    role: String!
  }

  type Product {
    id: ID!
    title: String!
    description: String!
    price: Float!
    image: String
    inStock: Boolean!
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    me: User
    products: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    register(name: String!, email: String!, password: String!, phone: String): AuthPayload!
    createProduct(title: String!, description: String!, price: Float!, image: String, inStock: Boolean!): Product!
    updateProduct(id: ID!, title: String, description: String, price: Float, image: String, inStock: Boolean): Product!
    deleteProduct(id: ID!): Boolean!
  }
`;

// Helper to get user from JWT
const getUserFromToken = (req: NextApiRequest) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/, "");
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch {
    return null;
  }
};

const resolvers = {
  Query: {
    async me(_: any, __: any, context: any) {
      if (!context.user) throw new Error("Not authenticated");
      const user = await User.findById(context.user.id);
      return user;
    },
    async products() {
      return await Product.find();
    },
    async product(_: any, { id }: { id: string }) {
      return await Product.findById(id);
    },
  },
  Mutation: {
    async login(_: any, { email, password }: { email: string; password: string }) {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");
      const token = jwt.sign({ id: user.id, role: user.role, email: user.email, name: user.name, phone: user.phone }, JWT_SECRET, { expiresIn: "7d" });
      return { token };
    },
    async register(_: any, { name, email, password, phone }: { name: string; email: string; password: string; phone?: string }) {
      const existing = await User.findOne({ email });
      if (existing) throw new Error("User already exists");
      const user = new User({ name, email, password, phone, role: "user" });
      await user.save();
      const token = jwt.sign({ id: user.id, role: user.role, email: user.email, name: user.name, phone: user.phone }, JWT_SECRET, { expiresIn: "7d" });
      return { token };
    },
    async createProduct(_: any, args: any, context: any) {
      if (!context.user || context.user.role !== "admin") throw new Error("Admin only");
      const product = new Product({ ...args });
      await product.save();
      return product;
    },
    async updateProduct(_: any, { id, ...rest }: any, context: any) {
      if (!context.user || context.user.role !== "admin") throw new Error("Admin only");
      const product = await Product.findByIdAndUpdate(id, rest, { new: true });
      if (!product) throw new Error("Product not found");
      return product;
    },
    async deleteProduct(_: any, { id }: { id: string }, context: any) {
      if (!context.user || context.user.role !== "admin") throw new Error("Admin only");
      const result = await Product.findByIdAndDelete(id);
      return !!result;
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }: { req: NextApiRequest }) => {
    await dbConnect();
    const user = getUserFromToken(req);
    return { user };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await apolloServer.start();
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
}
