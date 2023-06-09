import {
  ActionIcon,
  Box,
  Flex,
  Loader,
  Menu,
  Spoiler,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import dayjs from "dayjs";
// extend dayjs
import relativeTime from "dayjs/plugin/relativeTime";
import PostMeta from "./PostMeta";
import { Link } from "react-router-dom";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import TiptapLink from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import postService, { Post } from "../../services/post-service";
import AvatarHoverCard from "./AvatarHoverCard";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import commentService from "../../services/comment-service";
import CommentList from "../post/CommentList";
import CommentForm from "../forms/CommentForm";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { AxiosError } from "axios";
import { Response } from "../../services/http-service";
import { notifications } from "@mantine/notifications";
import { PostQuery } from "../../hooks/usePosts";
dayjs.extend(relativeTime);

const useStyles = createStyles((theme) => ({
  postItem: {
    marginBottom: rem(15),
    border: `${rem(1)} solid ${theme.colors.gray[2]}`,
  },
  postItemTop: {
    backgroundColor: "#ffffff",
    paddingLeft: rem(10),
    paddingRight: rem(10),
    paddingTop: rem(10),
    paddingBottom: rem(10),
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  heading: {
    textDecoration: "none",
    color: theme.colors.dark[4],
    fontFamily: `'Roboto Condensed', sans-serif`,
    padding: 0,
    marginTop: rem(10),
    marginBottom: rem(5),
    paddingLeft: rem(10),
  },
  summary: {
    textDecoration: "none",
    color: theme.colors.dark[4],
    padding: rem(10),
    paddingTop: 0,
  },
  username: {
    textDecoration: "none",
    color: theme.colors.dark[4],
    fontFamily: `'Roboto Condensed', sans-serif`,
    padding: 0,
    marginRight: rem(5),
  },
  datetime: {
    fontSize: 13,
  },
  follow: {
    fontSize: 14,
    color: theme.colors.blue,
    marginLeft: rem(5),
    textDecorationColor: theme.colors.blue,
    cursor: "pointer",
  },
}));

interface Props {
  post: Post;
  maxHeight?: number;
  postQuery?: PostQuery;
}

const PostItem = ({ post, maxHeight = 300, postQuery }: Props) => {
  const { classes } = useStyles();
  const { user: currentUser } = useAuth();
  const [showComment, setShowComment] = useState(false);

  //load comments
  const { data: comments, isLoading } = useQuery({
    queryKey: [post.id, "comments"],
    queryFn: () =>
      commentService.getAll({
        params: {
          postId: post.id,
        },
      }),
    enabled: showComment,
  });

  const queryClient = useQueryClient();

  //delete post
  const deletePost = useMutation<any, AxiosError<Response<null>>, Post>({
    mutationFn: (post) => postService.delete(post),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", postQuery]);
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.response?.data.message,
      });
    },
  });

  return (
    <Box className={classes.postItem}>
      <Box className={classes.postItemTop}>
        <Flex justify="space-between">
          <Flex justify="left" gap={10}>
            <AvatarHoverCard user={post.user} />
            <Box>
              <Flex align="center">
                <Link to={`/user/${post.user.id}`}>
                  <Text className={classes.username}>
                    {" "}
                    {post.user.username}
                  </Text>
                </Link>
                {/* ·
              <Box
                className={classes.follow}
                onClick={() => follow(post.user.id)}
              >
                {!isFollowingUser && "Follow"}
              </Box> */}
              </Flex>

              <Text className={classes.datetime}>
                {dayjs(post.ctime).fromNow()}
              </Text>
            </Box>
          </Flex>
          {currentUser && currentUser.id === post.user.id && (
            <Flex justify="flex-end" gap={10}>
              <Link to={`/edit/${post.id}`}>
                <ActionIcon size="sm" variant="transparent" radius="xl">
                  <IconEdit size="1.2rem" stroke={1.5} />
                </ActionIcon>
              </Link>
              {/* <ActionIcon size="sm" variant="transparent" radius="xl"> */}
              <Menu shadow="md">
                <Menu.Target>
                  <IconTrash
                    style={{ cursor: "pointer" }}
                    color="gray"
                    size="1.2rem"
                    stroke={1.5}
                  />
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    color="red"
                    icon={<IconTrash size={14} />}
                    onClick={() => deletePost.mutate(post)}
                  >
                    Delete?
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              {/* </ActionIcon> */}
            </Flex>
          )}
        </Flex>

        <Flex gap={3} justify="flex-start" direction="row" align="center">
          <Link to={`/post/${post.id}`} key={post.id}>
            <h4 className={classes.heading}>{post.title}</h4>
          </Link>
        </Flex>
        <Text className={classes.summary}>
          <Spoiler maxHeight={maxHeight} showLabel="Show more" hideLabel="Hide">
            <div
              dangerouslySetInnerHTML={{
                __html: generateHTML(JSON.parse(post.content), [
                  StarterKit,
                  Underline,
                  TiptapLink,
                  Superscript,
                  SubScript,
                  Highlight.configure(),
                  TextAlign,
                  Image,
                ]),
              }}
            ></div>
          </Spoiler>
        </Text>

        <PostMeta
          post={post}
          isShowComment={showComment}
          showComment={setShowComment}
        />
      </Box>
      <Box>
        {showComment && currentUser && <CommentForm postId={post?.id} />}
        {showComment && isLoading && (
          <Flex align="center" justify="center">
            <Loader variant="dots" />
          </Flex>
        )}
        {showComment && comments && <CommentList comments={comments} />}
      </Box>
    </Box>
  );
};

export default PostItem;
