import PostItem from "../shared/PostItem";
import { Box, Center, Loader, createStyles, rem } from "@mantine/core";
import usePosts, { PostQuery } from "../../hooks/usePosts";
import PostItemSkeleton from "./PostItemSkeleton";
import { useUpdateEffect } from "react-use";
import React from "react";

const useStyles = createStyles(() => ({
  postList: {
    marginBottom: rem(10),
    marginTop: rem(3),
  },
  page: {
    padding: rem(10),
    float: "right",
  },
}));

interface Props {
  postQuery: PostQuery;
}

const PostList = ({ postQuery }: Props) => {
  const { classes } = useStyles();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(postQuery);
  const skeleton = [1, 2, 3, 4, 5];

  useUpdateEffect(() => {
    // Add to the bottom event listener
    function handleScroll() {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;

      // Fetch next page
      if (scrollTop + clientHeight >= scrollHeight && hasNextPage) {
        fetchNextPage();
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <Box>
      <Box className={classes.postList}>
        {/* <Category
          setCategory={(cate) =>
            setPostQuery({ ...postQuery, category: cate, page: 0 })
          }
          currentCategory={postQuery.category}
        /> */}
        {isLoading && skeleton.map((key) => <PostItemSkeleton key={key} />)}
        {data?.pages?.map((page, key) => (
          <React.Fragment key={key}>
            {page?.data?.map((post, key) => (
              <PostItem post={post} key={key} postQuery={postQuery} />
            ))}
          </React.Fragment>
        ))}
      </Box>
      <Center>{isFetchingNextPage && <Loader size={20} />}</Center>
    </Box>
  );
};

export default PostList;
