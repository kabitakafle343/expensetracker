import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAddExpense, useUpdateExpense } from "../api/mutation";
import { useGetUserExpenseById } from "../api/query";

interface AddExpenseI {
  isOpen: boolean;
  onClose: () => void;
  editId: number | null;
}

interface ExpenseFormValues {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

const schema = yup.object({
  title: yup.string().required("Title is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  category: yup.string().required("Category is required"),
  date: yup.string().required("Date is required"),
  notes: yup.string().optional(),
});

const AddExpenses = ({ isOpen, onClose, editId }: AddExpenseI) => {
  const { data: getExpenseById } = useGetUserExpenseById(editId ?? null);
  const { mutate: updateExpense } = useUpdateExpense();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const { mutate: addExpense, isPending } = useAddExpense();
  const categories = [
    "Food",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills",
    "Health",
    "Education",
    "Travel",
    "Other",
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: getExpenseById?.title,
      amount: getExpenseById?.amount,
      category: getExpenseById?.category,
      date: getExpenseById?.date,
      notes: getExpenseById?.notes,
    },
  });
  useEffect(() => {
    if (editId && getExpenseById) {
      reset({
        title: getExpenseById.title,
        amount: getExpenseById.amount,
        category: getExpenseById.category,
        date: getExpenseById.date
          ? new Date(getExpenseById.date).toISOString().split("T")[0]
          : "",
        notes: getExpenseById.notes,
      });
    } else if (!editId) {
      reset({
        title: "",
        amount: undefined,
        category: "",
        date: "",
        notes: "",
      });
    }
  }, [editId, getExpenseById, reset]);
  const onSubmit = (values: ExpenseFormValues) => {
    const expenseData = {
      title: values.title,
      amount: values.amount,
      category: values.category,
      date: values.date,
      notes: values.notes,
    };

    if (editId) {
      updateExpense(
        {
          id: editId,
          ...expenseData,
        },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        },
      );
    } else {
      addExpense(expenseData, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={handleClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>Add Expense</AlertDialogHeader>
          <AlertDialogBody>
            <FormControl isInvalid={!!errors.title} mb={4}>
              <FormLabel>Title</FormLabel>
              <Input {...register("title")} />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.amount} mb={4}>
              <FormLabel>Amount</FormLabel>
              <Input type="number" {...register("amount")} />
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.category} mb={4}>
              <FormLabel>Category</FormLabel>

              <Select placeholder="Select category" {...register("category")}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>

              <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.date} mb={4}>
              <FormLabel>Date</FormLabel>
              <Input type="date" {...register("date")} />
              <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.notes}>
              <FormLabel>Notes</FormLabel>
              <Input {...register("notes")} />
              <FormErrorMessage>{errors.notes?.message}</FormErrorMessage>
            </FormControl>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={handleClose}
              isDisabled={isPending}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              ml={3}
              isLoading={isPending}
            >
              Add
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AddExpenses;
