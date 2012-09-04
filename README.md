jQuery Alert Panels
=============
-------------

Simple jQuery plugin to show alert panels at the top of a page. 
It's easy and simple to configure.

Usage
-------------

```javascript
// simple error message
$.alert("error", "This is a fatal error!");

// simple success message
$.alert("success", "Registration successful!");

// custom css and duration
$.alert({
  message: "mhh - this is a custom message panel",
  settings: { 
    duration: 10000, 
    css: { 
      color: "green", 
      backgroundColor: "yellow"
    }
  }
});
```

That's it !
Easy mh?

Demo
-------------
http://jsbin.com/ulisaz/1/