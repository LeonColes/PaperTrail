import { Container, Card, Button, useToast } from "reshaped";
import type { ToastProps } from "reshaped";

const Home = () => {
  const toast = useToast();

  const showToast = () => {
    toast.show({
      title: "Hello",
      text: "This is a toast",
    }) as ToastProps
  };

  return (
    <Container>
      <Card>
        <Button color="primary" variant="faded" onClick={showToast}>
          Faded button
        </Button>
      </Card>
    </Container>
  );
};

export default Home;
