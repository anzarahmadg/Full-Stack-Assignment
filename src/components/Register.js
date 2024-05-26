// Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Form,
  FormField,
  TextInput,
  Select,
  Anchor,
  Text,
} from "grommet";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8000/api/users", {
        username,
        password,
        email,
        role,
      });
      navigate("/");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <Box fill align="center" justify="center">
      <Box width="medium" margin={{ top: "large" }}>
        <Form
          onSubmit={handleRegister}
          validate="blur"
          messages={{ email: { email: "Invalid email format" } }}
        >
          <FormField label="Username" name="username">
            <TextInput
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormField>
          <FormField
            label="Email"
            name="email"
            required
            validate={{
              regexp: /^[^@]+@[^@]+\.[^@]+$/,
              message: "Invalid email format",
            }}
          >
            <TextInput
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>
          <FormField label="Password" name="password">
            <TextInput
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>
          <FormField label="Role" name="role">
            <Select
              options={["Admin", "Project Manager", "Team Member"]}
              value={role}
              onChange={({ option }) => setRole(option)}
            />
          </FormField>
          <Box direction="row" gap="medium">
            <Button type="submit" primary label="Register" />
            <Box margin={{ top: "xsmall" }} direction="row">
              <Text>Already Registered?</Text>
              <Box margin={{ left: "xsmall" }}>
                <Anchor color={"blue"} label="Sign In" href="/" />
              </Box>
            </Box>
          </Box>
        </Form>
      </Box>
    </Box>
  );
};

export default Register;
