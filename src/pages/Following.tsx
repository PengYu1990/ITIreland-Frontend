import { Grid, MediaQuery, Space } from "@mantine/core";
import ToTop from "../components/shared/ToTop";
import { useEffect, useState } from "react";

import AppConfig from "../config.json";
import FollowingPostList from "../components/following/FollowingPostList";
import AddPost from "../components/shared/AddPost";
import Category from "../components/shared/Category";
import { PostQuery } from "../hooks/usePosts";
import Ad from "../components/shared/Ad";

const Index = () => {
  const defaultPageSize = 10;
  const [postQuery, setPostQuery] = useState<PostQuery>({
    size: defaultPageSize,
  } as PostQuery);

  useEffect(() => {
    document.title = AppConfig.config.title;
  });

  return (
    <>
      <Grid grow>
        <MediaQuery smallerThan="md" styles={{ display: "none" }}>
          <Grid.Col span={2}>
            <Category
              setCategory={(cate) =>
                setPostQuery({ ...postQuery, category: cate, page: 0 })
              }
              currentCategory={postQuery.category}
            />
          </Grid.Col>
        </MediaQuery>
        <Grid.Col span={7}>
          <AddPost />
          <FollowingPostList postQuery={postQuery} />
        </Grid.Col>
        <MediaQuery smallerThan="md" styles={{ display: "none" }}>
          <Grid.Col span={3}>
            <Ad
              src="https://www.ncirl.ie/Portals/0/Images/650x366-Cards-Teasers-Inners/img-student-at-careers-event.jpg"
              link="https://www.ncirl.ie/"
            />
            <Space h="md" />
            <Ad
              top="17rem"
              src="https://www.ncirl.ie/Portals/0/NCI%20Summer%20Camp.jpg"
              link="https://www.ncirl.ie/Events/ArtMID/6569/ArticleID/870/TY-Summer-Camp"
            />
          </Grid.Col>
        </MediaQuery>
      </Grid>
      <ToTop />
    </>
  );
};

export default Index;
