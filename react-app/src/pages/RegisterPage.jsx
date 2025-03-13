import React, {useState, useEffect} from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { Link, useFetcher, useNavigate } from "react-router-dom"

const RegisterPage = () => {

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); 
  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if(fetcher.data){
      const {success, message, error} = fetcher.data;
      if(error){
        setMessage(error)
        setMessageType("error")
        return;
      }
      setMessage(message);
      if(success){
        setMessageType("success");
        setTimeout(() => {
          navigate("/login");
        }, 1500)
      }
      else{
        setMessageType("error")
      }
    }
  }, [fetcher.data])

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <fetcher.Form method="post" action="/register">
          <TextField fullWidth label="First Name" variant="outlined" margin="normal" name="f_name"/>
          <TextField fullWidth label="Last Name" variant="outlined" margin="normal" name="l_name"/>
          <TextField fullWidth label="Email" variant="outlined" margin="normal" type="email" name="email"/>
          <TextField fullWidth label="Password" variant="outlined" margin="normal" type="password" name="password"/>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
             {message == "success" ? "Signing Up..." : "Sign Up"}
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
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export const registerAction = async({ request }) => {
  const data = await request.formData();
  const first_name = data.get("f_name");
  const last_name = data.get("l_name");
  const email = data.get("email");
  const password = data.get("password");

  if (!first_name || !last_name || !email || !password){
    return {success: false, message: "Please fill in all fields"}
  }

  //check if email exist in the system
  try{
      const resForEmail = await fetch('/api/users/checkEmailExistance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if(resForEmail.ok){
        const answer = await resForEmail.json();
        if(answer.emailExist == true){
          return { success: false ,message: "Email already exist - try another one"}
        }
    
        //Regiset user
        const resRegistration = await fetch('/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ first_name, last_name, email, password }),
        });
    
        if(resRegistration.ok){
          const answer = await resRegistration.json();
          return {success: true, answer};
        }
  
      }

  }
  catch(err){
    return err;
  }

  

  


}

export default RegisterPage;
