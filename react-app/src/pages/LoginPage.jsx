import React,{ useState } from "react";
import { Container, TextField, Button, Typography, Box} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info"); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogIn = async(e) => {
        e.preventDefault();

        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password})
          })
        
        if(res.ok){
            const data = await res.json();
            setMessage(data.message);
            if(data.user){
                //successfull log in - user exist
                setMessageType("success");
                setTimeout(() => {
                    navigate(`/tasks`, {state: {user: data.user}})
                }, 1500)

            }
    
            else{
                console.log("User does not exist");
                setMessageType("error")
            }
        }
    };

    return (
        <Container maxWidth="sm">
        <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
            Log In
            </Typography>
            <form onSubmit={handleLogIn}>
            <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                {messageType === "success" ? "LOGIN IN..." : "LOG IN"}
            </Button>
            </form>

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

const loginAction = async({ request }) => {
    const data = await request.formData;
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
