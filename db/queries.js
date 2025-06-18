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
      include: { Post: true },
    });

    if (!author) {
      return null;
    }

    return author.Post;
  } catch (error) {
    console.error("Database error:", error);
    return { error };
  }
}

async function getPost(postId) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
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

async function postDeletePost(postId) {
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

async function postDeleteComment(commentId) {
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
  postDeletePost,
  postDeleteComment,
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
