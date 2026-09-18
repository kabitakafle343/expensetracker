
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
import { userSignUp } from "../api/mutation";

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
 
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>();

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      await userSignUp({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate("/")
      toast({
        title: "Account created!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err?.response?.data?.message ?? "Something went wrong",
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
            <Heading size="lg">Create your account</Heading>
            <Text color="gray.500" fontSize="sm">
              Start tracking your expenses in minutes
            </Text>
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Full Name</FormLabel>
                <Input
                 
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 2, message: "Name is too short" },
                  })}
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

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
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
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

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                 
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                <FormErrorMessage>
                  {errors.confirmPassword?.message}
                </FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                mt={2}
                isLoading={isSubmitting}
              >
                Sign Up
              </Button>
            </Stack>
          </form>

          <Text mt={6} textAlign="center" fontSize="sm" color="gray.500">
            Already have an account?{" "}
            <Link
              as={RouterLink}
              to={routesName.login}
              color="teal.500"
              fontWeight="medium"
            >
              Log in
            </Link>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};
