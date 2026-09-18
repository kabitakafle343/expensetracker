import { useMutation, useQueryClient } from "@tanstack/react-query";
import HttpClient from "./apis";

interface LoginI {
  email: string;
  password: string;
}
interface SignUpI {
  name: string;
  email: string;
  password: string;
}
interface addExpenseI {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}
interface UpdateExpenseI {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}
export const userLogin = (loginData: LoginI) => {
  return HttpClient.post("/users/signin", {
    email: loginData.email,
    password: loginData.password,
  });
};
export const userSignUp = (signupData: SignUpI) => {
  return HttpClient.post("/users/signup", {
    email: signupData.email,
    password: signupData.password,
    name: signupData.name,
  });
};

export const deleteExpense = (id: number) => {
  return HttpClient.delete(`expense/${id}`);
};

export const useDeleteExepense = () => {
  const queryCleint = useQueryClient();
  return useMutation({
    mutationKey: ["expense"],
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryCleint.invalidateQueries({ queryKey: ["expense"] });
    },
  });
};

export const addExpense = (data: addExpenseI) => {
  return HttpClient.post("/expense", {
    title: data.title,
    amount: data.amount,
    category: data.category,
    date: data.date,
    notes: data?.notes,
  });
};
export const useAddExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["expense"],
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense"] });
    },
  });
};

export const updateExpense = (data: UpdateExpenseI) => {
  return HttpClient.put(`/expense/${data.id}`, {
    title: data.title,
    amount: data.amount,
    category: data.category,
    date: data.date,
    notes: data?.notes,
  });
};

export const useUpdateExpense = () => {
  const queryClient=useQueryClient()
  return useMutation({
    mutationKey: ["expense"],
    mutationFn: updateExpense,
    onSuccess:() =>{
      queryClient.invalidateQueries({queryKey:["expense"]})
    
    },
  });
};
