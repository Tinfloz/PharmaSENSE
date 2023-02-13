# PharmaSENSE
PharmaSENSE aims at solving the “medical non-adherence and refilling gap” problem that is pervasive in the healthcare industry. The medical non-adherence and refilling issue means that a lot of patients (both young and old)
forget to consume their medicines and refill them in a timely fashion and this, in turn, results in consumption and refilling non-adherence.

# The how
The web app handles the entire process, right from measuring the amounts of each medicine that a patient is supposed to take to automating the delivery of the medicine. This is done by taking an initial measurement of the medicine bottle and the dosage per day. These measurements are then used to calculate a critical level (low level of medicine in the medicine bottle) and days left to reach the critical level. Once the bottle reaches the critical level a delivery request is created. Chemists and pharmacists close to the patient's accommodation can then accept this delivery request. The first pharmacist to accept the delivery request gets to deliver the medicine to the patient.
Patients get 3 options to add medicines to their profiles:
1) Manual: The patients have to fill up a form on the web app.
2) By voice: Patients can register a medicine to their profiles by voice. This method uses the JavaScript Web Speech API.
3) By scanning the qr code in the bottle: Most medicine bottles nowadays come with qr codes and these qr codes usually have the website of the company encoded in them. This website usually has information about the medicine. The server uses puppeteer to navigate to this website and OCR to extract information from the website. 

# Tech Stack
1) Mongo DB (ORM:Mongoose)
2) Express
3) React 
4) Nodejs
5) Google Maps Api
6) JavaScript Web Speech API
7) OCR (Tesseract.js)

# The app
![image](https://user-images.githubusercontent.com/106631326/218512380-835bee7e-1926-43f1-9249-ecdc96730eff.png)
![image](https://user-images.githubusercontent.com/106631326/218512561-eb28c893-b483-45e5-8d4c-c93c3ad7acbe.png)
![image](https://user-images.githubusercontent.com/106631326/218514159-619b73ab-5d7e-42bd-a713-ba22a8987a4e.png)
![image](https://user-images.githubusercontent.com/106631326/218514400-6349e1b3-4731-49c4-ad2a-c9364cda2768.png)
![image](https://user-images.githubusercontent.com/106631326/218514453-138fa595-8fac-4c9c-ae32-5c53ff7693f2.png)
![image](https://user-images.githubusercontent.com/106631326/218514502-8612803e-40b2-4da9-9da7-0669148b77ea.png)

# Future
1) Develop a mobile app.
2) The OCR method to register medicines needs to be streamlined
3) Add hardware component (IoT enabled bottles)
