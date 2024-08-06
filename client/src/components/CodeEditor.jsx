import React, { useState, Suspense, lazy, useEffect } from "react";
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
    IconButton,
    Grid,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import CodeIcon from "@mui/icons-material/Code";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

const VideoList = lazy(() => import("./VideoList"));

const theme = createTheme({
    palette: {
        primary: {
            main: "#4CAF50",
        },
        secondary: {
            main: "#FFC107",
        },
        background: {
            default: "#0B192F",
            paper: "#1E2A38",
        },
        text: {
            primary: "#FFFFFF",
            secondary: "#B0BEC5",
        },
    },
    typography: {
        fontFamily: "'Roboto', sans-serif",
        h3: {
            fontWeight: 700,
            fontSize: "2rem",
        },
        h6: {
            fontWeight: 500,
            fontSize: "1rem",
        },
        body2: {
            fontSize: "0.875rem",
        },
    },
});

function CodeEditor() {
    const location = useLocation();
    const data = location.state?.data || [];
    const { isLoading, isError, errorMessage } = useSelector(
        (state) => state.codeExecution
    );
    const [code, setCode] = useState(`${data.code}`);
    const [output, setOutput] = useState("");
    const [inp, setInp] = useState("");
    const [showEditor, setShowEditor] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const dispatch = useDispatch();
    const [filteredCode, setFilteredCode] = useState();

    const newCode = () => {
        const idx = code.indexOf("class Solution");
        setFilteredCode(() => {
            return code.substring(idx, code.indexOf("}"));
        });
    };

    useEffect(() => {
        newCode();
    }, []);

    const runCode = async () => {
        try {
            const resultAction = await dispatch(
                executeCode({ code, input: inp })
            );
            setOutput(resultAction.payload.run.output);
        } catch (error) {
            console.error("Execution error:", error);
            setOutput("Error: Something went wrong.");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container className="flex flex-col gap-7 py-8">
                <Box className="md:flex items-center justify-between mb-6">
                    <Typography
                        variant="h4"
                        component="h1"
                        className="text-white mb-4"
                    >
                        Problem Description
                    </Typography>
                    <Box className="flex items-center">
                        <IconButton
                            color="primary"
                            onClick={() => setShowVideo(!showVideo)}
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                transition: "transform 0.2s",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                },
                            }}
                        >
                            <VideoLibraryIcon />
                        </IconButton>
                        <Typography
                            variant="body2"
                            color={theme.palette.text.secondary}
                            sx={{ marginLeft: 1 }}
                        >
                            Video
                        </Typography>
                        <IconButton
                            color="primary"
                            onClick={() => setShowEditor(!showEditor)}
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                transition: "transform 0.2s",
                                marginLeft: 2,
                                "&:hover": {
                                    transform: "scale(1.05)",
                                },
                            }}
                        >
                            <CodeIcon />
                        </IconButton>
                        <Typography
                            variant="body2"
                            color={theme.palette.text.secondary}
                            sx={{ marginLeft: 1 }}
                        >
                            Editor
                        </Typography>
                    </Box>
                </Box>

                <div className="mb-6">
                    <Typography
                        variant="h6"
                        color={theme.palette.text.secondary}
                        className="mb-4"
                    >
                        {data.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color={theme.palette.text.secondary}
                    >
                        {data.desc}
                    </Typography>
                    {data?.examples?.map((v, i) => (
                        <Paper
                            key={i}
                            className="p-4 mt-4"
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                            }}
                        >
                            <Typography
                                variant="body2"
                                color={theme.palette.text.secondary}
                            >
                                <strong>Input:</strong> {v.input} <br />
                                <strong>Output:</strong> {v.output} <br />
                                <strong>Explanation:</strong> {v.explanation}
                            </Typography>
                        </Paper>
                    ))}
                </div>

                {(showVideo || showEditor) && (
                    <Grid container spacing={2}>
                        {showVideo && (
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        height: "70vh",
                                        backgroundColor:
                                            theme.palette.background.paper,
                                        padding: 2,
                                    }}
                                >
                                    <Suspense
                                        fallback={<div>Loading Video...</div>}
                                    >
                                        <VideoList videoUrl={data.videoUrl} />
                                    </Suspense>
                                </Box>
                            </Grid>
                        )}

                        {showEditor && (
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        height: "70vh",
                                        backgroundColor:
                                            theme.palette.background.paper,
                                        padding: 2,
                                    }}
                                >
                                    <Editor
                                        height="calc(70vh - 80px)"
                                        defaultLanguage="java"
                                        theme="vs-dark"
                                        value={code}
                                        onChange={(v) => setCode(v)}
                                        options={{
                                            fontSize: 16,
                                            minimap: { enabled: false },
                                            cursorStyle: "line-thin",
                                            scrollBeyondLastLine: false,
                                            scrollbar: {
                                                verticalScrollbarSize: 10,
                                                horizontalScrollbarSize: 10,
                                            },
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        height: "80px",
                                        backgroundColor:
                                            theme.palette.background.paper,
                                        padding: 2,
                                        marginTop: 2,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        className="mb-2"
                                        color={theme.palette.text.primary}
                                    >
                                        Output:
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        className={`whitespace-pre-wrap ${
                                            isError
                                                ? "text-red-500"
                                                : "text-light-green-400"
                                        }`}
                                    >
                                        {isLoading ? (
                                            <Box className="flex justify-center items-center h-full">
                                                <CircularProgress
                                                    size={24}
                                                    sx={{
                                                        color: theme.palette
                                                            .primary.main,
                                                    }}
                                                />
                                            </Box>
                                        ) : isError ? (
                                            `Error: ${errorMessage}`
                                        ) : (
                                            output || "Output will appear here"
                                        )}
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                )}

                <Box className="text-center mt-6">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={runCode}
                        disabled={isLoading}
                        sx={{
                            width: "200px",
                            fontWeight: 700,
                            transition: "transform 0.2s",
                            "&:hover": {
                                transform: "scale(1.05)",
                            },
                        }}
                    >
                        {isLoading ? "Running..." : "Run Code"}
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default CodeEditor;
