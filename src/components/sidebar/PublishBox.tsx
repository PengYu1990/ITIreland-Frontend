import { Button, Flex, createStyles, rem } from "@mantine/core";
import { AiOutlineEdit, AiOutlineQuestionCircle } from "react-icons/ai";
import { Link } from "react-router-dom";

const useStyles = createStyles(() => ({
  publish_box: {
    backgroundColor: "white",
    padding: rem(20),
    marginBottom: rem(20),
    marginTop: rem(3),
  },
}));

const PublishBox = () => {
  const { classes } = useStyles();
  return (
    <Flex
      className={classes.publish_box}
      gap={30}
      justify="center"
      direction="row"
    >
      <Link to="/edit">
        <Button variant="gradient" leftIcon={<AiOutlineEdit size={rem(18)} />}>
          Post
        </Button>
      </Link>
      <Button
        leftIcon={<AiOutlineQuestionCircle size={rem(18)} />}
        variant="default"
      >
        Ask
      </Button>
    </Flex>
  );
};

export default PublishBox;
