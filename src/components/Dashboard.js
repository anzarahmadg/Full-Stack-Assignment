import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Collapsible,
  Heading,
  Text,
  TextInput,
} from "grommet";
import { Add, FormClose } from "grommet-icons";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newTaskNames, setNewTaskNames] = useState({});
  const [newTaskDescriptions, setNewTaskDescriptions] = useState({});
  const [editTaskIds, setEditTaskIds] = useState({});
  const [collapsibleStates, setCollapsibleStates] = useState({});

  const token = localStorage.getItem("jwtToken");

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    fetchUserRoles();
    fetchProjects();
  }, []);

  const fetchUserRoles = async () => {
    const userName = localStorage.getItem("userName");
    if (!userName) {
      console.error("No userName or token found in localStorage.");
      return;
    }
    try {
      const response = await axiosInstance.get(
        `http://localhost:8000/api/users/${userName}`
      );
      sesionStorage.setItem("roles", response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };
  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:8000/api/projects"
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const addProject = () => {
    setShowAddProject(true);
  };

  const saveProject = async () => {
    if (newProjectName.trim() === "") return;

    try {
      const response = await axiosInstance.post(
        "http://localhost:8000/api/projects",
        {
          name: newProjectName,
        }
      );
      setProjects([...projects, response.data]);
      setNewProjectName("");
      setShowAddProject(false);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await axiosInstance.delete(
        `http://localhost:8000/api/projects/${projectId}`
      );
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const addTask = async (projectId) => {
    if (newTaskNames[projectId]?.trim() === "") return;

    try {
      const response = await axiosInstance.post(
        `http://localhost:8000/api/tasks/${projectId}`,
        {
          name: newTaskNames[projectId],
          description: newTaskDescriptions[projectId],
        }
      );
      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? { ...project, tasks: [...project.tasks, response.data] }
            : project
        )
      );
      setNewTaskNames({ ...newTaskNames, [projectId]: "" });
      setNewTaskDescriptions({ ...newTaskDescriptions, [projectId]: "" });
      setCollapsibleStates({ ...collapsibleStates, [projectId]: false });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (projectId, taskId) => {
    try {
      await axiosInstance.delete(
        `http://localhost:8000/api/tasks/${projectId}/${taskId}`
      );
      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.filter((task) => task.id !== taskId),
              }
            : project
        )
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const updateTask = async (projectId, taskId) => {
    try {
      const response = await axiosInstance.put(
        `http://localhost:8000/api/tasks/${projectId}/${taskId}`,
        {
          name: newTaskNames[`${projectId}-${taskId}`],
          description: newTaskDescriptions[`${projectId}-${taskId}`],
        }
      );
      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map((task) =>
                  task.id === taskId ? response.data : task
                ),
              }
            : project
        )
      );
      setEditTaskIds({ ...editTaskIds, [`${projectId}-${taskId}`]: false });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const toggleCollapsible = (projectId) => {
    setCollapsibleStates({
      ...collapsibleStates,
      [projectId]: !collapsibleStates[projectId],
    });
  };

  const toggleEditTask = (projectId, taskId) => {
    setEditTaskIds({
      ...editTaskIds,
      [`${projectId}-${taskId}`]: !editTaskIds[`${projectId}-${taskId}`],
    });
  };

  return (
    <Box fill align="center" pad="medium">
      <Heading level="2">Dashboard</Heading>
      <Box
        direction="row"
        wrap
        justify="center"
        gap="medium"
        position="relative"
      >
        {projects.map((project) => (
          <Card key={project.id} background="light-1" width="medium">
            <CardHeader
              pad={{ horizontal: "medium", vertical: "small" }}
              direction="row"
              justify="between"
              align="center"
            >
              <Heading level="3" margin="none">
                {project.name}
              </Heading>
              <Button
                icon={<FormClose />}
                onClick={() => deleteProject(project.id)}
              />
            </CardHeader>
            <CardBody pad="medium">
              {project.tasks.map((task) => (
                <Box
                  key={task.id}
                  border={{ color: "light-4", size: "xsmall" }}
                  pad="small"
                  margin={{ bottom: "small" }}
                >
                  {editTaskIds[`${project.id}-${task.id}`] ? (
                    <>
                      <TextInput
                        placeholder="Task Name"
                        value={
                          newTaskNames[`${project.id}-${task.id}`] || task.name
                        }
                        onChange={(event) =>
                          setNewTaskNames({
                            ...newTaskNames,
                            [`${project.id}-${task.id}`]: event.target.value,
                          })
                        }
                        margin={{ bottom: "small" }}
                      />
                      <TextInput
                        placeholder="Task Description"
                        value={
                          newTaskDescriptions[`${project.id}-${task.id}`] ||
                          task.description
                        }
                        onChange={(event) =>
                          setNewTaskDescriptions({
                            ...newTaskDescriptions,
                            [`${project.id}-${task.id}`]: event.target.value,
                          })
                        }
                        margin={{ bottom: "small" }}
                      />
                      <Box direction="row" gap="small">
                        <Button
                          label="Update"
                          onClick={() => updateTask(project.id, task.id)}
                        />
                        <Button
                          label="Cancel"
                          onClick={() => toggleEditTask(project.id, task.id)}
                        />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Text weight="bold">{task.name}</Text>
                      <Text>{task.description}</Text>
                      <Box direction="row" gap="small">
                        <Button
                          label="Edit"
                          onClick={() => toggleEditTask(project.id, task.id)}
                        />
                        <Button
                          icon={<FormClose />}
                          onClick={() => deleteTask(project.id, task.id)}
                        />
                      </Box>
                    </>
                  )}
                </Box>
              ))}
              <Collapsible open={collapsibleStates[project.id]}>
                <Box align="center" justify="center" pad="small">
                  <Box pad="xxsmall">
                    <TextInput
                      placeholder="New Task Name"
                      value={newTaskNames[project.id] || ""}
                      onChange={(event) =>
                        setNewTaskNames({
                          ...newTaskNames,
                          [project.id]: event.target.value,
                        })
                      }
                      margin={{ bottom: "medium" }}
                    />
                  </Box>
                  <Box pad={{ bottom: "xsmall" }}>
                    <TextInput
                      placeholder="Task Description"
                      value={newTaskDescriptions[project.id] || ""}
                      onChange={(event) =>
                        setNewTaskDescriptions({
                          ...newTaskDescriptions,
                          [project.id]: event.target.value,
                        })
                      }
                      margin={{ bottom: "small" }}
                    />
                  </Box>
                  <Box direction="row">
                    <Box margin="xxsmall">
                      <Button
                        label="Save Task"
                        onClick={() => addTask(project.id)}
                      />
                    </Box>
                    <Box margin="xxsmall">
                      <Button
                        label="Cancel"
                        onClick={() => {
                          setCollapsibleStates({
                            ...collapsibleStates,
                            [project.id]: false,
                          });
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Collapsible>
              <Button
                label="Add Task"
                onClick={() => toggleCollapsible(project.id)}
              />
            </CardBody>
          </Card>
        ))}
        {showAddProject ? (
          <Card background="light-1" width="medium">
            <CardBody pad="medium" align="center">
              <TextInput
                placeholder="New Project Name"
                value={newProjectName}
                onChange={(event) => setNewProjectName(event.target.value)}
                margin={{ bottom: "small" }}
              />
              <Box direction="row">
                <Box margin="xxsmall">
                  <Button label="Save" onClick={saveProject} />
                </Box>
                <Box margin="xxsmall">
                  <Button
                    label="Cancel"
                    onClick={() => setShowAddProject(false)}
                  />
                </Box>
              </Box>
            </CardBody>
          </Card>
        ) : (
          <Card background="light-1" width="medium">
            <CardBody pad="medium" align="center">
              <Button icon={<Add />} label="Add Project" onClick={addProject} />
            </CardBody>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
