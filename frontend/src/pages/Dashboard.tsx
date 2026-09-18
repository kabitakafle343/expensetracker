import { useMemo } from "react";
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Heading,
  Text,
  Flex,
  Button,
  Spinner,
  VStack,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useGetAllUserExpenses } from "../api/query";
import AddExpenses from "../components/AddExpenses";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#B5560F",
  Transport: "#2159C4",
  Housing: "#6A3FCB",
  Utilities: "#1B8A5A",
  Entertainment: "#C22D75",
  Health: "#C33131",
  Shopping: "#96700B",
};
const FALLBACK_COLOR = "#57534E";

const currency = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

export const DashBoard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading } = useGetAllUserExpenses();
  const expenses: Expense[] = data ?? [];
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    return "Good night";
  };

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const todayStr = now.toDateString();

  // ---- Summary stats ----
  const { total, thisMonth, today } = useMemo(() => {
    let total = 0;
    let thisMonth = 0;
    let today = 0;

    expenses.forEach((e) => {
      const d = new Date(e.date);
      total += e.amount;
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        thisMonth += e.amount;
      }
      if (d.toDateString() === todayStr) {
        today += e.amount;
      }
    });

    return { total, thisMonth, today };
  }, [expenses]);

  // ---- Monthly spending (last 6 months) ----
  const monthlyData = useMemo(() => {
    const months: { label: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      months.push({
        label: d.toLocaleDateString("en-IN", { month: "short" }),
        total: 0,
      });
    }

    expenses.forEach((e) => {
      const d = new Date(e.date);
      const monthsAgo =
        (currentYear - d.getFullYear()) * 12 + (currentMonth - d.getMonth());
      if (monthsAgo >= 0 && monthsAgo <= 5) {
        months[5 - monthsAgo].total += e.amount;
      }
    });

    return months;
  }, [expenses]);

  // ---- Spending by category ----
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  // ---- Recent expenses (last 5) ----
  const recent = useMemo(
    () =>
      [...expenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [expenses],
  );

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="lg">{getGreeting()}</Heading>
          <Text color="gray.500" mt={1}>
            Here's your expense overview
          </Text>
        </Box>
        <Button colorScheme="blue" onClick={onOpen}>
          + Add Expense
        </Button>
      </Flex>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <StatCard title="Total Spent" value={`Rs. ${currency.format(total)}`} />
        <StatCard
          title="This Month"
          value={`Rs. ${currency.format(thisMonth)}`}
        />
        <StatCard
          title="Today's Spending"
          value={`Rs. ${currency.format(today)}`}
        />
        <StatCard title="Total Transactions" value={`${expenses.length}`} />
      </SimpleGrid>

      {/* Charts */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <Heading size="md" mb={4}>
            Monthly Spending
          </Heading>
          <Box height="300px">
            {monthlyData.every((m) => m.total === 0) ? (
              <Flex height="full" align="center" justify="center">
                <Text color="gray.400">No data yet</Text>
              </Flex>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDEBE8" />
                  <XAxis dataKey="label" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value) => [
                      `Rs. ${currency.format(Number(value))}`,
                    ]}
                  />
                  <Bar dataKey="total" fill="#2159C4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Box>

        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <Heading size="md" mb={4}>
            Spending by Category
          </Heading>
          <Box height="300px">
            {categoryData.length === 0 ? (
              <Flex height="full" align="center" justify="center">
                <Text color="gray.400">No data yet</Text>
              </Flex>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => entry.name}
                  >
                    {categoryData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={CATEGORY_COLORS[entry.name] ?? FALLBACK_COLOR}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `Rs. ${currency.format(Number(value))}`,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Box>
      </SimpleGrid>

      {/* Recent Expenses */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
        <Flex justify="space-between" align="center" mb={5}>
          <Heading size="md">Recent Expenses</Heading>
          <Button variant="ghost" colorScheme="blue">
            View All
          </Button>
        </Flex>

        {recent.length === 0 ? (
          <Text color="gray.500">Your recent expenses will appear here.</Text>
        ) : (
          <VStack align="stretch" spacing={3}>
            {recent.map((e) => (
              <HStack
                key={e._id}
                justify="space-between"
                py={2}
                borderBottom="1px solid #F1EFED"
              >
                <Box>
                  <Text fontWeight="500">{e.title}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(e.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </Box>
                <Text fontWeight="600">Rs. {currency.format(e.amount)}</Text>
              </HStack>
            ))}
          </VStack>
        )}
      </Box>
      <AddExpenses isOpen={isOpen} onClose={onClose} editId={null} />
    </Box>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <Box bg="white" p={5} borderRadius="lg" boxShadow="sm">
      <Stat>
        <StatLabel color="gray.500">{title}</StatLabel>
        <StatNumber mt={2}>{value}</StatNumber>
      </Stat>
    </Box>
  );
};
