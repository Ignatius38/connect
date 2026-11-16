# ProConnect — Software Development Life Cycle (SDLC) Documentation

## 1. Use Case Diagram
Illustrates the system boundary, external actors (**Student / Aspirant** and **Professional Mentor**), and the core functional and accessibility interactions supported by ProConnect.

```mermaid
flowchart LR
    Student(["Student / Aspirant"])
    Mentor(["Professional Mentor"])

    subgraph ProConnect["ProConnect Web Platform"]
        UC1(["Register Account"])
        UC2(["Log In / Authenticate"])
        UC3(["Toggle Keyboard Focus Assist"])
        UC4(["Browse & Filter Mentors"])
        UC5(["Send Mentorship Request"])
        UC6(["Track Request Status & View Mentor Email"])
        UC7(["View Incoming Student Requests"])
        UC8(["Accept or Decline Request"])
    end

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6

    Mentor --> UC1
    Mentor --> UC2
    Mentor --> UC3
    Mentor --> UC7
    Mentor --> UC8