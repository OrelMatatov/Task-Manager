import React,{ useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box} from "@mui/material";
import { Link, useNavigate, useFetcher, Form  } from "react-router-dom";

const LoginPage = () => {

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info"); 
    const fetcher = useFetcher();
    const navigate = useNavigate();

    useEffect(() => {
        if (fetcher.data) {
            const { message, user, error } = fetcher.data;
            setMessage(message);
            if (user) {
                setMessageType("success");
                setTimeout(() => 
                    navigate(`/tasks`, { state: { user } })
                , 1500);
            } else {
                setMessageType("error");
            }
        }
    }, [fetcher.data]);


    return (
        <Container maxWidth="sm">
        <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
            Log In
            </Typography>
            <fetcher.Form method="post" action="/login">
            <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                name="email"
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                name="password"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                {messageType === "success" ? "LOGIN IN..." : "LOG IN"}
            </Button>
            </fetcher.Form>

            {message && (
            <Typography
                variant="body2"
                sx={{
                mt: 2,
                color: messageType === "success" ? "green" : messageType === "error" ? "red" : "blue",
                }}
            >
                {message}
            </Typography>
            )}

            <Typography variant="body2" sx={{ mt: 2 }}>
            Don't have an account? <Link to="/register">Sign up</Link>
            </Typography>
        </Box>
        </Container>
    );
    
}

export const loginAction = async({ request }) => {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");

    const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if(res.ok){
        const data = await res.json();
        return data;
    }

    return {error: "bad API request"}
}

export default LoginPage
