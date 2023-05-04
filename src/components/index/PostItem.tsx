import { Box, Text, createStyles, rem } from "@mantine/core";
import { Post } from "../../hooks/usePosts";
import dayjs from "dayjs";
// extend dayjs
import relativeTime from "dayjs/plugin/relativeTime";
import PostMeta from "../shared/PostMeta";
import { createShortcut, removeTags } from "../../utils/common";
import { Link } from "react-router-dom";
import { generateHTML } from "@tiptap/react";
import Paragraph from "@tiptap/extension-paragraph";
import Bold from "@tiptap/extension-bold";
// Option 2: Browser-only (lightweight)
// import { generateHTML } from '@tiptap/core'
import Document from "@tiptap/extension-document";
import TipTapText from "@tiptap/extension-text";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import TiptapLink from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
dayjs.extend(relativeTime);

const useStyles = createStyles((theme) => ({
  postItem: {
    paddingLeft: rem(10),
    paddingRight: rem(10),
    paddingTop: rem(2),
    paddingBottom: rem(5),
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  heading: {
    textDecoration: "none",
    color: theme.colors.dark[4],
    fontFamily: `'Roboto Condensed', sans-serif`,
    padding: 0,
  },
  summary: {
    textDecoration: "none",
    color: theme.colors.dark[4],
  },
}));

interface Props {
  post: Post;
}

const PostItem = ({ post }: Props) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.postItem}>
      <Link to={`/post/${post.id}`} key={post.id}>
        <h3 className={classes.heading}>{post.title}</h3>
        <Text className={classes.summary}>
          {removeTags(
            createShortcut(
              generateHTML(JSON.parse(post.content), [
                Document,
                Paragraph,
                TipTapText,
                Bold,
                StarterKit,
                Underline,
                TiptapLink,
                Superscript,
                SubScript,
                Highlight.configure(),
                TextAlign,
                CodeBlockLowlight,
                // other extensions …
              ]),
              320
            )
          )}
        </Text>
      </Link>
      <PostMeta post={post} />
    </Box>
  );
};

export default PostItem;
