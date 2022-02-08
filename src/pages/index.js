import * as React from "react";
import { graphql } from "gatsby";
// import * as dayjs from "dayjs";
import { Helmet } from "react-helmet";
import Tour from "./../components/Tour";
import * as dayjs from "dayjs";
import dayjsPluginUTC from "dayjs-plugin-utc";
dayjs.extend(dayjsPluginUTC);

let Tours = [];

// markup
const IndexPage = ({
  data: {
    allMarkdownRemark: { edges },
  },
  extensions,
}) => {
  React.useEffect(() => {
    // tours
    let currentDate = dayjs();

    edges.forEach((edge) => {
      edge.node.frontmatter.events.sort(function (a, b) {
        if (!a.date || !b.date) return 0;
        else return dayjs(a.date) - dayjs(b.date);
      });
      edge.node.frontmatter.events = edge.node.frontmatter.events.filter(
        (event) => {
          if (!event.date) return true;
          else return dayjs(event.date) > currentDate;
        }
      );
    });

    // if all events have expired, filter out this tour OR we arent live yet
    edges = edges.filter(
      (edge) =>
        edge.node.frontmatter.events.length > 0 &&
        dayjs(edge.node.frontmatter.liveTime) < currentDate
    );

    edges.sort(function (a, b) {
      return (
        dayjs(b.node.frontmatter.liveTime) - dayjs(a.node.frontmatter.liveTime)
      );
    });

    Tours = edges.map((edge) => (
      <Tour key={edge.node.id} tour={edge.node.frontmatter} />
    ));
  }, []);

  return (
    <>
      <Helmet>
        <meta charset="UTF-8" />
        <title>Atsuko Presents Hi</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="MobileOptimized" content="320" />
        <link rel="canonical" href="https://www.atsukolive.com" />
        <meta name="description" content="Atsuko Present HI! Live!" />
        <meta property="og:site_name" content="Atsuko Live!" />
        <meta property="og:title" content="Atsuko Live!" />
        <meta property="og:url" content="https://www.atsukolive.com" />
        <meta property="og:type" content="website" />
        <link
          rel="shortcut icon"
          href="https://www.atsukolive.com/assets/images/icon.png"
        ></link>
      </Helmet>

      <body>
        <div className="container">
          <div className="side">
            <img
              src="main-graphic.png"
              width="557"
              height="965"
              alt="Hi Graphic"
            />
            <a href="https://www.realgoodtouring.com" target="_blank">
              <img
                src="rgt-trimmed.png"
                width="94"
                height="80"
                className="rgt desktop"
              />
            </a>
          </div>
          <div className="dates">
            <div style={{ width: "80%", margin: "1em auto 0 auto" }}>
              <div className="video-player-container">
                <iframe
                  className="video-player"
                  src="https://www.youtube.com/embed/BLLfkV6ZJVU?controls=1&modestbranding=0&showinfo=0&rel=0"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>

            <ul className="date-list">{Tours}</ul>

            <a href="https://www.realgoodtouring.com" target="_blank">
              <img
                src="rgt-trimmed.png"
                width="94"
                height="80"
                className="mobile"
              />
            </a>
          </div>
        </div>
      </body>
    </>
  );
};
export default IndexPage;

export const AllToursJsonQuery = graphql`
  query AllToursQuery {
    allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/(tours)/" } }) {
      edges {
        node {
          id
          frontmatter {
            title
            Image {
              childImageSharp {
                gatsbyImageData(
                  width: 500
                  blurredOptions: { width: 100 }
                  placeholder: BLURRED
                  transformOptions: { cropFocus: NORTH }
                )
              }
            }
            liveTime
            events {
              ticketsLink
              date
              isSoldOut
              location
              venueName
              note
            }
          }
        }
      }
    }
  }
`;
