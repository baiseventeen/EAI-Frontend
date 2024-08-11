import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginPage/LoginPage.vue')
    },
    {
      path: '/course',
      name: 'course',
      component: () => import('../views/CoursePage/CoursePage.vue')
    },
    {
      path: '/home',
      name: 'home',
      redirect: '/home/courseSquare',
      component: () => import('../layout/Layout/Layout.vue'),
      children: [
        {
          path: 'courseSquare',
          name: 'courseSquare',
          component: () => import("../views/CourseSquare/index.vue")
        },
        {
          path: 'courseDetail/:courseId',
          name: 'courseDetail',
          component: () => import("../views/CourseSquare/component/CourseDetails/index.vue")
        },
        {
          path: 'moreCourse',
          name: 'moreCourse',
          component: () => import("../views/CourseSquare/component/AllCourse/MoreCourse.vue"),
          props(route) {
            return route.query
          },
        },
        {
          path: 'myCourse',
          name: 'myCourse',
          component: () => import("../views/CoursePage/CoursePage.vue")
        },
        {
          path: 'myHomework',
          name: 'myHomework',
          component: () => import("@/views/HomeworkPage/index.vue")
        },
        {
          path: 'homeworkDetail/:assignmentId',
          name: 'homeworkDetail',
          component: () => import("@/views/HomeworkPage/component/HomeworkDetail.vue")
        },
        {
          path: 'assignment/:assignmentId/edit',
          name: 'edit',
          component: () => import('../views/EditPage/EditPage.vue')
        },
        {
          path: 'assignment/:assignmentId/correct',
          name: 'correct',
          component: () => import('../views/CorrectPage/CorrectPage.vue')
        },
        {
          path: 'myCorrect/course',
          name: 'myCorrectWithCourse',
          component: () => import("@/views/CorrectPage/CoursePage.vue")
        },
        {
          path: 'myCorrect/assignment',
          name: 'myCorrectWithAssignment',
          component: () => import("@/views/CorrectPage/AssignmentPage.vue")
        },
        {
          path: 'myCorrect/assignment/:assignmentId',
          name: 'myCorrectWithAssignmentId',
          component: () => import("@/views/CorrectPage/CorrectAssignmentPage.vue")
        },
      ]
    },
  ]
})

export default router
