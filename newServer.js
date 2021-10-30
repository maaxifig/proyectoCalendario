const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
    {id: 4, name: 'course4'},
    {id: 5, name: 'course5'}
];

app.get('/', (req, res) => {

    res.send('Hello world!');

});


app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {

    if (!req.body.name || req.body.name.length < 3) {
        // 400 Bad request
        res.status(400).send('Name is required and should be minimum 3 characters!');
        return;
    }

    const course = {
        id: courses.length +1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    //look up the courses , if not exisiting , return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found!');


    // Validate
    // If invalid , return 400 - Bad request
    if (!req.body.name || req.body.name.length < 3) {
            // 400 Bad request
            res.status(400).send('Name is required and should be minimum 3 characters!');
            return;
        }

    // Update course
    // Return the updated course
    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/course/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.')

    const index = courses.indexOf(course);
    course.splice(index, 1);

    res.send(course);
});







app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found!');
    res.send(course);
});

app.get('/api/posts/:year/:month' , (req, res) => {
    res.send(req.params);
});

app.get('/api/posts/:year/:month' , (req, res) => {
    res.send(req.query);
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
