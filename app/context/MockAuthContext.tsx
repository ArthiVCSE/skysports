"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import type { JwtPayload } from "@/lib/types/auth";

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

const client = new ApolloClient({
  link: new HttpLink({ uri: "/api/graphql", credentials: "include" }),
  cache: new InMemoryCache(),
});

interface LoginMutationResult {
  login: { token: string };
}

interface RegisterMutationResult {
  register: { token: string };
}

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

function userFromToken(token: string): User | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return {
      id: decoded.id,
      name: decoded.name ?? "",
      email: decoded.email ?? "",
      phone: decoded.phone,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

function readStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("authToken");
  if (!token) return null;
  const user = userFromToken(token);
  if (!user) localStorage.removeItem("authToken");
  return user;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const login = async (email: string, password: string) => {
    const { data } = await client.mutate<LoginMutationResult>({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    });
    if (!data?.login.token) throw new Error("Login failed");
    const token = data.login.token;
    localStorage.setItem("authToken", token);
    const nextUser = userFromToken(token);
    if (nextUser) setUser(nextUser);
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const { data } = await client.mutate<RegisterMutationResult>({
      mutation: REGISTER_MUTATION,
      variables: { name, email, password, phone },
    });
    if (!data?.register.token) throw new Error("Registration failed");
    const token = data.register.token;
    localStorage.setItem("authToken", token);
    const nextUser = userFromToken(token);
    if (nextUser) setUser(nextUser);
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
