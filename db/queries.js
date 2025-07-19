const prisma = require("./prisma");

// async function getUserByUsername(username) {
//   return prisma.user.findUnique({
//     where: { username },
//   });
// }

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

async function getPostsByAuthor(username) {
  try {
    const author = await prisma.author.findUnique({
      where: { username: username },
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
      return null;
    }

    return author;
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

async function postNewPost(title, text, authorId) {
  try {
    const post = await prisma.post.create({
      data: {
        title,
        text,
        authorId,
        published: true,
      },
    });

    return post;
  } catch (error) {
    console.error("Database error creating post:", error);
    throw new Error("Failed to create post.");
  }
}

async function postNewComment(text, userId = null, authorId = null, parentId) {
  try {
    console.log("postNewComment authorId");
    console.log(authorId);
    const comment = await prisma.comment.create({
      data: {
        text,
        // authorId,
        userId,
        parentId,
      },
    });

    return comment;
  } catch (error) {
    console.error("Database error creating comment:", error);
    throw new Error("Failed to create comment.");
  }
}

async function updatePost(postId, title, text, authorId) {
  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        text,
        authorId,
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
  getAuthor,
  getUser,
  getPostsByAuthor,
  getPost,
  getPostComments,
  postNewPost,
  postNewComment,
  updatePost,
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
