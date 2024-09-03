import { Container } from "@mui/material";
import { RequestsContainer } from "@/src/containers/Requests/RequestsContainer";

const Requests = () => {
  return (
    <Container component="main" maxWidth="xl">
      <RequestsContainer />
    </Container>
  );
};

export default Requests;
