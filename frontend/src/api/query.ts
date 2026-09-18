import { useQuery } from "@tanstack/react-query";
import HttpClient from "./apis";

export const getAllUserExpenses = () => {
  return HttpClient.get("/expense");
};

export const useGetAllUserExpenses = () => {
  return useQuery({
    queryKey: ["expense"],
    queryFn: getAllUserExpenses,
    select: (res) => res?.data?.expenses,
  });
};

export const getUserExpenseById = (id: number | null) => {
  return HttpClient.get(`/expense/${id}`);
};

export const useGetUserExpenseById = (id: number | null) => {
  return useQuery({
    queryKey: ["expense", id],
    queryFn: () => getUserExpenseById(id),
    select: (res) => res?.data?.expense,
    enabled: !!id,
  });
};
