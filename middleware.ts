import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/uploadthing", "/api/socket/io"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};






// // import { authMiddleware } from "@clerk/nextjs";

// // export default authMiddleware({
// //   publicRoutes: ["/api/uploadthing"]
// // });

// // export const config = {
// //   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
// // };

// import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({
//   publicRoutes: [
//     "/", 
//     "/sign-in", 
//     "/sign-up", 
//     "/api/uploadthing", 
//     "/api/socket/io", 
//     "/servers/ccbd219b-7485-46cc-b93b-915fe357789f"
//   ],
//   ignoredRoutes: [
//     "/((?!api|trpc))(_next.*|.+\\.[\\w]+$)"
//   ],
//   afterAuth: (auth, req, evt) => {
//     if (!auth.userId && !auth.isPublicRoute) {
//       // Redirect to sign-in page if the user is not authenticated and the route is not public
//       return new Response(null, {
//         status: 302,
//         headers: {
//           Location: "/sign-in",
//         },
//       });
//     }
//     // Custom behavior after authentication
//     console.log("User authenticated:", auth.userId);
//     return new Response(null, { status: 200 });
//   },
// });

// export const config = {
//   matcher: [
//     "/((?!.*\\..*|_next).*)", 
//     "/", 
//     "/(api|trpc)(.*)"
//   ],
// };