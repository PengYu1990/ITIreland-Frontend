import { Box, Button, createStyles, rem } from "@mantine/core";
import useCategories from "../../hooks/useCategories";

const useStyles = createStyles((theme) => ({
  category: {
    padding: rem(15),
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    backgroundColor: "#ffffff",
    position: "sticky",
    top: "4rem",
  },
  badge: {
    width: "100%",
    marginTop: rem(5),
    borderRadius: 0,
    fontSize: rem(14),
    marginRight: rem(15),
    paddingLeft: rem(8),
    paddingRight: rem(8),
  },
}));

interface Props {
  currentCategory?: string | null;
  setCategory: (category: string) => void;
}

const Category = ({ currentCategory, setCategory }: Props) => {
  const { classes } = useStyles();

  const { data } = useCategories();

  return (
    <Box className={classes.category}>
      {currentCategory == null || currentCategory === "" ? (
        <Button
          className={classes.badge}
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          onClick={() => setCategory("")}
          size="xs"
        >
          All Topics
        </Button>
      ) : (
        <Button
          className={classes.badge}
          variant="light"
          gradient={{ from: "indigo", to: "cyan" }}
          onClick={() => setCategory("")}
          size="xs"
        >
          {" "}
          All Topics
        </Button>
      )}
      {/* {isLoading && skeleton.map((key) => <CategorySkeleton key={key} />)} */}

      {data?.map((category, key) => {
        if (currentCategory === category.category) {
          return (
            <Button
              key={key}
              className={classes.badge}
              variant="gradient"
              onClick={() => {
                console.log("cate clicked");
                setCategory(category.category);
              }}
              size="xs"
            >
              {category.category}
            </Button>
          );
        }

        return (
          <Button
            key={key}
            className={classes.badge}
            onClick={() => {
              console.log("cate clicked");
              setCategory(category.category);
            }}
            variant="light"
            size="xs"
          >
            {category.category}
          </Button>
        );
      })}
    </Box>
  );
};

export default Category;
