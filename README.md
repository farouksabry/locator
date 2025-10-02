# Project Name
Where to Find

## Overview
A full-stack application with Django REST Framework backend and Vite + React frontend.

## Distinctiveness and Complexity
Where to Find is a project different from all the projects I did and it took a lot of hard work, patience and learning as it's not built with only what we learned in this course.
After finishing the course material, I learnt the following:
    1- React: I took a course in React to help me make single page applications as this is the most popular now.
    2- Djano REST framework: It took much time to learn about DRF in order to build APIs to deal with frontend and this is to separate the backend and it's APIs from the frontend. Also, I learnt about DRF serializers to simplify dealing with models and translate each model instance into JSON response using DRF serializers.
    3- Axios: I learnt Axios and how to deal with backend endpoints using Axios.
    4- Axios Interceptors: This feature was great for me to catch 401 and 403 responses and try to refresh the token and this acts like man in the middle to the request.
    5- Authenticating - JWT: This topic here is one of the most difficult topics I dealt with and it really took much much time to understand and to apply. I started to learn authentication scheme in DRF and how authentication is done and I found that authentication is done with Token Authentication and I searched more and found that saving the token in local storage is possible but it's not secure as it's vulnerable to XSS Attacks and I wanted to make the app more secure, so I found a third party package named JSON Web Token Authentication - JWT - and that took much time understanding it and knowing how to make Access token, Refresh token and Verification token and I did custom authentication not basic authentication it was complex for me but i liked doing it more secure to start doing this in production.

After completing this project, I am very proud of successfully doing it with these new technologies for me and that I built over the course material and learnt much beyond it and not doing it the easy way.
I talked to people in the web application industry and they told me that projects in production is not being done with the complexity of JWT, they just use local storage.
Finally, where to find is a project I am very very proud that I built with good technologies and it's a single page application like real projects in the market.
Where to Find is a project I am willing to push to production but I need to make it's user experience much better to be like real projects using UI UX.

### Getting started
# Backend setup
    1- admin.py:
        Registering models to be viewed in admin panel.
    2- api.py:
        Endpoints for each API to be dealt with from the frontend.
    3- authentication.py:
        This file contains a class named CookieJWTAuthentication that extends BasicAuthentication class and it's trying to fetch the access token and the user related to it in order to verify the user is logged in.
    4- models.py:
        Contains models related to the project.
    5- serializers.py: DRF serializers built upon Django models.
    6- tokens.py:
        It contains a class for Email verification token and it's details.
    7- urls.py: 
        URLs for the backend to be dealt with from frontend.

# Frontend setup:
    1- frontend/src/api/axiosinstance.js:
        A Javascript file to catch Axios responses with 401 and 403 response to refresh the Access token using the Refresh token by sending a request to the refresh token endpoint and if the refresh request failed, navigate to login.
    2- VerifyEmail.jsx:
        A component for verifying user email.
    3- Home.jsx:
        The home component that views posts related to each country and region.
    4- LoginForm.jsx:
        The login form component.
    5- Navbar.jsx:
        The navbar component to be viewed and it's not being viewed in login and registration pages.
    6- Post.jsx:
        The post component to view each post and it's comments.
    7- Profile.jsx:
        Profile component to view profile details and posts.
    8- Register.jsx
        Register component to view registration form.
    9- AuthLayout.jsx:
        The layout to hold components related to authenticated users.
    10- PublicLayout.jsx:
        The layout to hold components related to unauthenticated users.
    11- AuthContext.jsx:
        Context to be used to verify the user is logged in or not by sending a request to check-auth endpoint.
    12- LocationsContext.jsx:
        Context to be used to get all countries and regions.
    13- csrf.js:
        Javascript file to get csrf token used in requests.

# Running the application:
    1- In the backend dir, /locator, run the command
        pip install -r requirements.txt
        python manage.py runserver

    2- In the frontend dir, /locator/frontend, run the command
        npm install
        npm run dev

    3- And then visit the url printed from running the frontend server.

    4- After registration, you need to verify the email using the link sent in the terminal in the dir of the backend.
