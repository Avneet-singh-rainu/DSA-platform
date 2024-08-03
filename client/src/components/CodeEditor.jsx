import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { executeCode } from "../store/codeExecutionSlice";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Grid,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff",
    },
    background: {
      default: "#1e1e1e",
      paper: "#282c34",
    },
    text: {
      primary: "#fff",
      secondary: "#9e9e9e",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h3: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

function CodeEditor() {
  const location = useLocation();
  const codes = location.state?.data?.code || [];
  const { isLoading, isError, errorMessage } = useSelector(
    (state) => state.codeExecution
  );

  const [code, setCode] = useState(
    `public class HelloWorld {\n${codes[0] || ""}\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`
  );
  const [output, setOutput] = useState("");
  const [inp, setInp] = useState("");
  const dispatch = useDispatch();

  // Function to run the code and fetch the output
  const runCode = async () => {
    try {
      const resultAction = await dispatch(executeCode({ code, input: inp }));
      setOutput(resultAction.payload.run.output);
    } catch (error) {
      console.error("Execution error:", error);
      setOutput("Error: Something went wrong.");
    }
  };

  return (
    <div className="min-w-full min-h-screen">
    <ThemeProvider theme={theme}>
      <Container className="flex flex-col min-w-full min-h-screen ">
        <div className="flex-grow">
          <Typography variant="h3" component="h1" className="mb-4 text-white font-bold">
            Java Code Editor
          </Typography>

          <Grid container spacing={4} >
            <Grid item xs={12} md={8}>
              <Paper className="p-4 h-[40vh] md:h-[80vh] bg-background-paper overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="java"
                  theme="vs-dark"
                  value={code}
                  onChange={(v) => setCode(v)}
                  options={{
                    fontSize: 16,
                    minimap: { enabled: false },
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper className="p-4 mb-2 bg-background-paper">
                <Typography variant="h6" className="text-white mb-2">
                  Input:
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={inp}
                  onChange={(e) => setInp(e.target.value)}
                  className="bg-gray-800 text-white"
                  InputProps={{
                    classes: {
                      notchedOutline: "border-gray-600",
                    },
                  }}
                  sx={{
                    "&:hover fieldset": {
                      borderColor: "#777",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                    },
                  }}
                />
              </Paper>

              <Paper className="p-4 bg-background-paper text-white h-[calc(40vh-94px)] md:h-[calc(60vh-94px)] overflow-auto">
                <Typography variant="h6" className="mb-2">
                  Output:
                </Typography>
                <Typography
                  variant="body2"
                  className={`whitespace-pre-wrap ${
                    isError ? "text-red-500" : "text-teal-300"
                  }`}
                >
                  {isLoading ? (
                    <Box className="flex justify-center items-center h-full">
                      <CircularProgress size={24} sx={{ color: "primary.main" }} />
                    </Box>
                  ) : isError ? (
                    `Error: ${errorMessage}`
                  ) : (
                    output || "Output will appear here"
                  )}
                </Typography>
              </Paper>

        <div className="p-4 bg-background-paper">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={runCode}
            disabled={isLoading}
            className="w-48 h-12 text-lg font-bold bg-primary-main hover:bg-blue-800"
          >
            {isLoading ? "Running..." : "Run Code"}
          </Button>
        </div>
            </Grid>
          </Grid>
        </div>

      </Container>
    </ThemeProvider>
    </div>
  );
}

export default CodeEditor;
