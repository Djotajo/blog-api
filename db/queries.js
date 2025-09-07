const prisma = require("./prisma");

async function postNewAuthor(username, hashedPassword) {
  try {
    const author = await prisma.author.create({
      data: { username: username, passwordHash: hashedPassword },
    });
    return author;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

async function postNewUser(username, hashedPassword) {
  try {
    const user = await prisma.user.create({
      data: { username: username, passwordHash: hashedPassword },
    });
    return user;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const [author, user] = await Promise.all([
      prisma.author.findUnique({ where: { username } }),
      prisma.user.findUnique({ where: { username } }),
    ]);
    if (author) {
      return { role: "author", user: author };
    }
    if (user) {
      return { role: "user", user };
    }

    return { success: false, error: "User not found" };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
}

async function getAuthor(username) {
  try {
    const author = await prisma.author.findUnique({
      where: { username: username },
    });
    return author;
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
}

async function getUser(username) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    return user;
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
}

// async function getUserById(id) {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: id },
//     });
//     return user;
//   } catch (error) {
//     console.error("Database error:", error);
//     return { success: false, error };
//   }
// }

async function getPostsByAuthor(authorId) {
  try {
    console.log("ovo radi");
    const author = await prisma.author.findUnique({
      where: { id: authorId },
      select: {
        id: true,
        username: true,
        createdAt: true,
        Post: {
          include: {
            Comment: true, // This will include all comments associated with each post
          },
        },
      },
    });

    if (!author) {
      console.log("no author");
      return null;
    }
    return author;
  } catch (error) {
    console.error("Database error:", error);
    return { error };
  }
}

async function getAllPosts() {
  try {
    const posts = await prisma.post.findMany({
      // where: { published: true },

      include: {
        author: true,
        Comment: true, // This will include all comments associated with each post
      },
    });

    if (!posts) {
      console.log("no posts");
      return null;
    }

    return posts;
  } catch (error) {
    console.error("Database error:", error);
    return { error };
  }
}

async function getAllDrafts() {
  try {
    const drafts = await prisma.post.findMany({
      where: { published: false },
      include: {
        author: true,
      },
    });

    if (!drafts) {
      console.log("no posts");
      return null;
    }
    return drafts;
  } catch (error) {
    console.error("Database error:", error);
    return { error };
  }
}

async function getAllDraftsByAuthor(authorId) {
  try {
    const drafts = await prisma.post.findMany({
      where: { published: false, authorId: authorId },
      include: {
        author: true,
      },
    });

    if (!drafts) {
      console.log("no posts");
      return null;
    }

    return drafts;
  } catch (error) {
    console.error("Database error:", error);
    return { error };
  }
}

async function getAllPostsByAuthor(authorId) {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: authorId },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!posts) {
      console.log("no posts");
      return null;
    }

    return posts;
  } catch (error) {
    console.error("Database error:", error);
    return { error };
  }
}

async function getPost(postId) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        text: true,
        author: true,
        createdAt: true,
        // Comment: true,
        Comment: {
          // <--- Make sure this matches the relation name on your Post model
          include: {
            // Include the User who made the comment (if any)
            commentByUser: {
              select: {
                id: true,
                username: true, // Assuming your User model has a 'name' field
                // Add other user fields you need
              },
            },
            // Include the Author who made the comment (if any)
            commentByAuthor: {
              select: {
                id: true,
                username: true, // Assuming your Author model has a 'name' field
                // Add other author fields you need
              },
            },
          },
          orderBy: {
            createdAt: "asc", // Order comments by creation date
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    return post;
  } catch (error) {
    console.error("Database error:", error);
    return { error };
  }
}

async function postNewPost(id, title, text, authorId, published) {
  try {
    const post = await prisma.post.create({
      data: {
        id,
        title,
        text,
        authorId,
        published,
      },
    });

    return post;
  } catch (error) {
    console.error("Database error creating post:", error);
    throw error;
  }
}

async function postNewComment(text, userId = null, authorId = null, parentId) {
  if (!userId && !authorId) {
    throw new Error(
      "A comment must be associated with either a user or an author."
    );
  }

  if (userId && authorId) {
    throw new Error(
      "A comment cannot be associated with both a user and an author."
    );
  }

  console.log(userId);
  console.log(authorId);
  try {
    const data = {
      text,
      ...(userId && { userId }),
      ...(authorId && { authorId }),
      parentId,
    };
    const comment = await prisma.comment.create({ data });

    return comment;
  } catch (error) {
    console.error("Database error creating comment:", error);
    throw new Error("Failed to create comment.");
  }
}

async function editComment(commentId, text) {
  try {
    const comment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: {
        text,
      },
    });

    return comment;
  } catch (error) {
    console.error("Database error editing comment:", error);
    throw new Error("Failed to edit comment bro.");
  }
}

async function updatePost(postId, title, text, published) {
  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        text,
        published,
      },
    });

    return post;
  } catch (error) {
    console.error("Database error updating post:", error);
    throw error;
  }
}

async function updateDraft(postId, title, text) {
  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        text,
      },
    });

    return post;
  } catch (error) {
    console.error("Database error updating post:", error);
    throw new Error("Failed to update post.");
  }
}

async function postPostPublish(postId) {
  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        published: true,
      },
      include: {
        author: true,
      },
    });

    return updatedPost;
  } catch (error) {
    console.error("Database error:", error);
    return { error };
  }
}

async function postPostUnpublish(postId) {
  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        published: false,
      },
      include: {
        author: true,
      },
    });

    return updatedPost;
  } catch (error) {
    console.error("Database error:", error);
    return { error };
  }
}

async function getPostComments(postId) {
  try {
    const comments = await prisma.comment.findMany({
      where: { parentId: postId },
      orderBy: { createdAt: "asc" },
      include: {
        commentByUser: true,
        commentByAuthor: true,
      },
    });

    return comments;
  } catch (error) {
    console.error("Database error:", error);
    return { error };
  }
}

async function deletePost(postId) {
  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return { success: false, error: "Post not found" };
    }
    await prisma.post.delete({
      where: { id: postId },
    });
    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
}

async function deleteComment(commentId) {
  try {
    const existingComment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!existingComment) {
      return { success: false, error: "Comment not found" };
    }
    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });
    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
}

module.exports = {
  postNewAuthor,
  postNewUser,
  getUserByUsername,
  getAuthor,
  getUser,
  getPostsByAuthor,
  getAllPosts,
  getAllDrafts,
  getAllDraftsByAuthor,
  getAllPostsByAuthor,
  getPost,
  getPostComments,
  postNewPost,
  postNewComment,
  editComment,
  updatePost,
  updateDraft,
  postPostPublish,
  postPostUnpublish,
  deletePost,
  deleteComment,
};

// async function postRootFolder(userId) {
//   try {
//     await prisma.folder.create({
//       data: {
//         title: "Root",
//         owner: { connect: { id: userId } },
//         // No parent => this is the root folder
//       },
//     });
//     return { success: true };
//   } catch (error) {
//     console.error("Database error:", error);
//     return { success: false, error };
//   }
// }

// async function getRootFolder(userId) {
//   try {
//     const root = await prisma.folder.findFirst({
//       where: {
//         ownerId: userId,
//         parentId: null,
//         // No parent => this is the root folder
//       },
//       include: {
//         children: true,
//         files: true,
//       },
//     });
//     console.log(root);
//     return root;
//   } catch (error) {
//     console.error("Database error:", error);
//     throw error;
//   }
// }

// async function postNewFolder(title, ownerId, parentId = null) {
//   try {
//     const data = {
//       title,
//       owner: { connect: { id: ownerId } },
//     };

//     if (parentId) {
//       data.parent = { connect: { id: parentId } };
//     }

//     await prisma.folder.create({ data });
//     return { success: true };
//   } catch (error) {
//     console.error("Database error:", error);
//     return { success: false, error };
//   }
// }

// async function getFolderById(id) {
//   try {
//     const folder = await prisma.folder.findUnique({
//       where: { id: id },
//       include: { children: true, files: true },
//     });
//     console.log(folder);
//     return folder;
//   } catch (error) {
//     console.error("Database error:", error);
//     return { success: false, error };
//   }
// }

// async function postNewFile(title, link, uploaderId, parentId, size) {
//   try {
//     const data = {
//       title,
//       link,
//       uploader: { connect: { id: uploaderId } },
//       parent: { connect: { id: parentId } },
//       size,
//     };

//     // if (parentId) {
//     //   data.parent = { connect: { id: parentId } };
//     // }

//     await prisma.file.create({ data });
//     return { success: true };
//   } catch (error) {
//     console.error("Database error:", error);
//     return { success: false, error };
//   }
// }
