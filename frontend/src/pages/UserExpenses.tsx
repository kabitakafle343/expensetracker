import { useMemo, useState } from "react";
import { useGetAllUserExpenses } from "../api/query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Card,
  CardBody,
  Heading,
  Flex,
  IconButton,
  Spinner,
  VStack,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { FiEdit2, FiTrash2, FiInbox } from "react-icons/fi";
import { useDeleteExepense } from "../api/mutation";
import AddExpenses from "../components/AddExpenses";

const CATEGORY_COLORS: Record<string, { bg: string; fg: string }> = {
  Food: { bg: "#FDF0E6", fg: "#B5560F" },
  Transport: { bg: "#EAF2FE", fg: "#2159C4" },
  Housing: { bg: "#F1EDFB", fg: "#6A3FCB" },
  Utilities: { bg: "#E9F7F1", fg: "#1B8A5A" },
  Entertainment: { bg: "#FDEEF5", fg: "#C22D75" },
  Health: { bg: "#FEECEC", fg: "#C33131" },
  Shopping: { bg: "#FFF6DE", fg: "#96700B" },
};
const FALLBACK_COLOR = { bg: "#F1F1EF", fg: "#57534E" };

const categoryStyle = (category: string) =>
  CATEGORY_COLORS[category] ?? FALLBACK_COLOR;

const currency = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export const UserExpenses = () => {
  const [editId, setEditId] = useState<number | null>(null);
  const { data, isLoading } = useGetAllUserExpenses();
  const { mutate: deleteUserExpense } = useDeleteExepense();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        cell: ({ getValue }: any) => (
          <Text fontWeight="500" color="#1C1917">
            {getValue()}
          </Text>
        ),
      },
      {
        header: "Category",
        accessorKey: "category",
        cell: ({ getValue }: any) => {
          const { bg, fg } = categoryStyle(getValue());
          return (
            <Box
              as="span"
              display="inline-block"
              bg={bg}
              color={fg}
              fontSize="13px"
              fontWeight="500"
              borderRadius="6px"
              px="8px"
              py="2px"
            >
              {getValue()}
            </Box>
          );
        },
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: ({ getValue }: any) => (
          <Text fontSize="14px" color="#78716C">
            {new Date(getValue()).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        ),
      },
      {
        header: "Notes",
        accessorKey: "notes",
        cell: ({ getValue }: any) => (
          <Text fontSize="14px" color="#78716C" noOfLines={1} maxW="220px">
            {getValue() || "—"}
          </Text>
        ),
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ getValue }: any) => (
          <Text fontWeight="600" color="#1C1917" textAlign="right">
            Rs. {currency.format(getValue())}
          </Text>
        ),
      },
      {
        header: "",
        id: "actions",
        cell: ({ row }: any) => {
          const expense = row.original;
          return (
            <Flex gap={1} justify="flex-end">
              <IconButton
                aria-label="Edit expense"
                icon={<FiEdit2 size={15} />}
                size="sm"
                variant="ghost"
                color="#78716C"
                _hover={{ bg: "#F1EFED", color: "#1C1917" }}
                onClick={() => {
                  onOpen();
                  setEditId(expense._id);
                }}
              />
              <IconButton
                aria-label="Delete expense"
                icon={<FiTrash2 size={15} />}
                size="sm"
                variant="ghost"
                color="#78716C"
                _hover={{ bg: "#FEECEC", color: "#C33131" }}
                onClick={() => {
                  deleteUserExpense(expense._id);
                }}
              />
            </Flex>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const total = useMemo(
    () =>
      (data ?? []).reduce((sum: number, e: any) => sum + (e.amount ?? 0), 0),
    [data],
  );

  return (
    <Box p={{ base: 4, md: 6 }} bg="#FAFAF9" minH="100vh">
      <Card
        borderRadius="12px"
        border="1px solid #EDEBE8"
        boxShadow="none"
        overflow="hidden"
        maxW="1000px"
        mx="auto"
      >
        <CardBody p={0}>
          <Flex width="full" justifyContent="flex-end" p={4}>
            <Button
              bg="#ffff"
              _hover={{ background: "#ffff" }}
              color="#1C1917"
              fontWeight="500"
              border="1px solid #E7E5E4"
              borderRadius="8px"
              onClick={onOpen}
            >
              Add Expense
            </Button>
          </Flex>

          <Flex px={6} py={5} justify="space-between" align="center">
            <Box>
              <Heading size="md" color="#1C1917" fontWeight="600">
                My Expenses
              </Heading>
              <Text mt="2px" fontSize="14px" color="#78716C">
                {data?.length
                  ? `${data.length} recorded`
                  : "Track what you spend"}
              </Text>
            </Box>

            {!!data?.length && (
              <Box textAlign="right">
                <Text fontSize="13px" color="#78716C">
                  Total
                </Text>
                <Text fontSize="20px" fontWeight="700" color="#1C1917">
                  Rs. {currency.format(total)}
                </Text>
              </Box>
            )}
          </Flex>

          {isLoading ? (
            <Flex justify="center" align="center" py={16}>
              <Spinner size="md" color="#78716C" thickness="2px" />
            </Flex>
          ) : (
            <TableContainer>
              <Table variant="simple" size="md">
                <Thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id} borderTop="1px solid #EDEBE8">
                      {headerGroup.headers.map((header) => (
                        <Th
                          key={header.id}
                          textTransform="none"
                          letterSpacing="normal"
                          fontSize="13px"
                          fontWeight="500"
                          color="#A8A29E"
                          borderColor="#EDEBE8"
                          textAlign={
                            header.column.id === "amount" ? "right" : "left"
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </Thead>

                <Tbody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <Tr
                        key={row.id}
                        _hover={{ bg: "#FAFAF9" }}
                        transition="background 0.1s ease"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <Td
                            key={cell.id}
                            borderColor="#EDEBE8"
                            textAlign={
                              cell.column.id === "amount" ? "right" : "left"
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </Td>
                        ))}
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={columns.length} border="none" py={16}>
                        <VStack spacing={3}>
                          <Box color="#D6D3D1">
                            <FiInbox size={28} />
                          </Box>
                          <Text color="#78716C" fontSize="14px">
                            No expenses yet — add your first one to start
                            tracking.
                          </Text>
                        </VStack>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </CardBody>
      </Card>
      <AddExpenses isOpen={isOpen} onClose={onClose} editId={editId} />
    </Box>
  );
};
