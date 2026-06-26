"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import jwtDecode from "jwt-decode";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Apollo client pointing at the GraphQL endpoint
const client = new ApolloClient({
  link: new HttpLink({ uri: "/api/graphql", credentials: "include" }),
  cache: new InMemoryCache(),
});

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $phone: String) {
    register(name: $name, email: $email, password: $password, phone: $phone) {
      token
    }
  }
`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({ id: decoded.id, name: decoded.name, email: decoded.email, phone: decoded.phone, role: decoded.role });
      } catch {
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await client.mutate({ mutation: LOGIN_MUTATION, variables: { email, password } });
    const token = data.login.token;
    localStorage.setItem("authToken", token);
    const decoded: any = jwtDecode(token);
    setUser({ id: decoded.id, name: decoded.name, email: decoded.email, phone: decoded.phone, role: decoded.role });
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const { data } = await client.mutate({ mutation: REGISTER_MUTATION, variables: { name, email, password, phone } });
    const token = data.register.token;
    localStorage.setItem("authToken", token);
    const decoded: any = jwtDecode(token);
    setUser({ id: decoded.id, name: decoded.name, email: decoded.email, phone: decoded.phone, role: decoded.role });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
