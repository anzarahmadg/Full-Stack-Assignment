// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, Form, FormField, TextInput, Anchor, Text } from "grommet";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    navigate("/dashboard");
    try {
      const response = await axios.post("http://localhost:8000/api/token", {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <Box fill align="center" justify="center" margin={{ top: "xlarge" }}>
      <Box width="medium" margin={{ top: "large" }}>
        <Form onSubmit={handleLogin}>
          <FormField label="Username" name="username">
            <TextInput
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <Box direction="column" gap="medium">
            <Button
              margin={{ top: "7%" }}
              type="submit"
              primary
              label="Login"
            />
            <Box direction="row" alignSelf="center">
              <Text>Don't have an account?</Text>
              <Box margin={{ left: "xsmall" }}>
                <Anchor color={"blue"} label="Register" href="/register" />
              </Box>
            </Box>
          </Box>
        </Form>
      </Box>
    </Box>
  );
};

export default Login;
