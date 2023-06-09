import {
  Box,
  Button,
  Group,
  MultiSelect,
  Select,
  TextInput,
  createStyles,
  rem,
} from "@mantine/core";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RichEditor from "../components/shared/RichEditor";
import { JSONContent } from "@tiptap/react";
import { useUpdateEffect } from "react-use";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useEditPost from "../hooks/useEditPost";
import postService, { Post } from "../services/post-service";
import { useAuth } from "../components/context/AuthContext";
import { AxiosError } from "axios";
import { Response } from "../services/http-service";

const useStyles = createStyles(() => ({
  form: {
    paddingTop: rem(10),
    paddingBottom: rem(55),
  },
  editor: {
    minHeight: rem(500),
  },
  mt10: {
    marginTop: rem(10),
  },
  mY10: {
    marginTop: rem(10),
    marginBottom: rem(10),
  },
}));

const categories = ["Backend", "Frontend", "Fullstack", "IT News"];

const PostEdit = () => {
  const [jsonContent, setJsonContent] = useState<JSONContent>();
  const { classes } = useStyles();
  const history = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();

  const { user } = useAuth();

  // remove cache
  const queryClient = useQueryClient();
  queryClient.cancelQueries([id, "post"]);

  const { data } = useEditPost(id);

  // Initial values
  useUpdateEffect(() => {
    window.scrollTo(0, 0);
    data && form.setValues({ title: data?.title, category: data?.category });
    document.title = data ? "Edit post : " + data?.title : "Add a post";

    // set JsonContent state
    data && setJsonContent(JSON.parse(data.content));
  }, [pathname, data]);

  const form = useForm({
    initialValues: {
      title: "",
      category: "",
    },

    validate: {
      title: (value) => (value.length < 1 ? "Title can not be empty" : null),
      category: (value) =>
        value.length < 1 ? "Category must be selected" : null,
    },
  });

  const submitPost = (values: any) => {
    if (user === null) {
      notifications.show({
        title: "Notification",
        message: "You need to login before post",
        color: "red",
      });
      return;
    }

    if (data && user.id != data.user.id) {
      notifications.show({
        title: "Notification",
        message: "You can only edit your own post",
        color: "red",
      });
      return;
    }

    values = { ...values, contentJson: jsonContent, userId: user.id };

    if (id) {
      values = { ...values, id: id };
    }

    if (values.contentJson == null || values.contentJson === "") {
      notifications.show({
        title: "Notification",
        message: "Content can not be empty",
        color: "red",
      });
      return;
    }

    savePost.mutate(values);
  };

  const savePost = useMutation<Post, AxiosError<Response<null>>, Post>({
    mutationFn: (post: Post) => postService.post(post),
    onSuccess: (savedPost) => {
      notifications.show({
        title: "Notification",
        message: "Post success",
        color: "blue",
      });
      // redirect to detail page
      history(`/post/${savedPost.id}`);
    },
    onError: (error) => {
      notifications.show({
        title: "Notification",
        message: error.response?.data.message,
        color: "red",
      });
    },
  });

  const tags = [
    { value: "Java", label: "Java" },
    { value: "Python", label: "Python" },
    { value: "Golang", label: "Golang" },
    { value: "React", label: "React" },
    { value: "Angular", label: "Angular" },
    { value: "Svelte", label: "Svelte" },
    { value: "Vue", label: "Vue" },
    { value: "Riot", label: "Riot" },
    { value: "Next.js", label: "Next.js" },
    { value: "Blitz.js", label: "Blitz.js" },
  ];

  return (
    <Box className={classes.form}>
      <form onSubmit={form.onSubmit((values) => submitPost(values))}>
        <TextInput
          withAsterisk
          placeholder="Please type title"
          {...form.getInputProps("title")}
        />
        <Select
          className={classes.mY10}
          data={categories}
          placeholder="Category"
          {...form.getInputProps("category")}
        />
        <RichEditor
          defaultJsonContent={data?.content}
          getJsonContent={(content) => setJsonContent(content)}
        />
        <MultiSelect
          style={{ marginTop: rem(10) }}
          data={tags}
          placeholder="Tags"
          searchable
          nothingFound="Nothing found"
          {...form.getInputProps("tags")}
        />

        <Group position="right" mt="md">
          <Button type="submit" disabled={savePost.isLoading}>
            {savePost.isLoading ? "Submitting" : "Submit"}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default PostEdit;
