// pages/Login.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Stack,
  Text,
  Link,
  Container,
  useToast,
} from "@chakra-ui/react";
import { routesName } from "../route/route.constant";
import { userLogin } from "../api/mutation";
import TokenService from "../api/tokenservice";

interface LoginFormValues {
  email: string;
  password: string;
}

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await userLogin(data);
      TokenService.setToken({access:response.data?.token});
  
      
      toast({
        title: "Welcome back!",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      navigate(routesName.dashboard);
    } catch (err: any) {
      toast({
        title: "Login failed",
        description:
          err?.response?.data?.message ?? "Invalid email or password",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" bg="gray.50">
      <Container maxW="md">
        <Box
          bg="white"
          p={8}
          borderRadius="xl"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.100"
        >
          <Stack spacing={1} mb={6} textAlign="center">
            <Heading size="lg">Welcome back</Heading>
            <Text color="gray.500" fontSize="sm">
              Log in to continue to your dashboard
            </Text>
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
               
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
             
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      //   icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPassword((s) => !s)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                mt={2}
                isLoading={isSubmitting}
              >
                Log In
              </Button>
            </Stack>
          </form>

          <Text mt={6} textAlign="center" fontSize="sm" color="gray.500">
            Don't have an account?{" "}
            <Link
              as={RouterLink}
              to={routesName.signup}
              color="teal.500"
              fontWeight="medium"
            >
              Sign up
            </Link>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};
