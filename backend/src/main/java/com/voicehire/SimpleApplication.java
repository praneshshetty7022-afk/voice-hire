package com.voicehire;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@RestController
@RequestMapping
public class SimpleApplication {

    // --- In-Memory Production Data Stores ---
    private static final Map<String, Map<String, Object>> USERS_DB = new ConcurrentHashMap<>();
    private static final Map<String, Map<String, Object>> JOBS_DB = new ConcurrentHashMap<>();
    private static final Map<String, Map<String, Object>> APPLICATIONS_DB = new ConcurrentHashMap<>();
    private static final List<Map<String, Object>> CATEGORIES_LIST = new ArrayList<>();

    // --- Allowed Low-Literacy Skilled Worker Categories ---
    private static final Set<String> ALLOWED_CATEGORIES = new HashSet<>(Arrays.asList(
        "DRIVER", "CARPENTER", "PAINTER", "ELECTRICIAN", "PLUMBER", "MASON",
        "COOK", "CLEANER", "HOUSEKEEPER", "GARDENER", "MECHANIC", "CONSTRUCTION_WORKER",
        "FACTORY_WORKER", "DELIVERY_WORKER", "FARM_WORKER", "LOADER", "WELDER", "TAILOR", "SECURITY_GUARD"
    ));

    public static void main(String[] args) {
        initCategories();
        initSeedJobs();
        SpringApplication.run(SimpleApplication.class, args);
        System.out.println("✅ VoiceHire Backend active on port 8082!");
    }

    private static void initCategories() {
        String[][] categoryData = {
            {"DRIVER", "Driver (गाड़ी ड्राइवर / ಚಾಲಕ)", "🚗"},
            {"CARPENTER", "Carpenter (बढ़ई / ಮರಗೆಲಸ)", "🪚"},
            {"PAINTER", "Painter (पेंटर / ಬಣ್ಣ ಬಳೆಯುವವ)", "🎨"},
            {"ELECTRICIAN", "Electrician (इलेक्ट्रीशियन / ಎಲೆಕ್ಟ್ರಿಷಿಯನ್)", "⚡"},
            {"PLUMBER", "Plumber (प्लम्बर / ಪ್ಲಂಬರ್)", "🔧"},
            {"MASON", "Mason (राजमिस्त्री / ಮೇಸ್ತ್ರಿ)", "🧱"},
            {"COOK", "Cook (रसोइया / ಅಡುಗೆಯವ)", "🧑‍🍳"},
            {"CLEANER", "Cleaner / Housekeeper (सफाई वाला / ಸ್ವಚ್ಛತಾಗಾರ)", "🧹"},
            {"GARDENER", "Gardener (माली / ತೋಟಗಾರ)", "🌱"},
            {"MECHANIC", "Mechanic (मेकेनिक / ಮೆಕ್ಯಾನಿಕ್)", "⚙️"},
            {"CONSTRUCTION_WORKER", "Construction Worker (निर्माण मजदूर / ಕಟ್ಟಡ ಕಾರ್ಮಿಕ)", "🏗️"},
            {"FACTORY_WORKER", "Factory Helper (फैक्ट्री मजदूर / ಕಾರ್ಖಾನೆ ಕೆಲಸ)", "🏭"},
            {"DELIVERY_WORKER", "Delivery Rider (डिलीवरी ब्वॉय / ಡೆಲಿವರಿ ಕಾರ್ಮಿಕ)", "📦"},
            {"FARM_WORKER", "Farm Worker (किसान / ಕೃಷಿ ಕಾರ್ಮಿಕ)", "🌾"},
            {"LOADER", "Loader / Helper (हेल्पर / ಲೌಡರ್)", "📦"},
            {"WELDER", "Welder (वेल्डर / ವೆಲ್ಡರ್)", "👨‍🏭"},
            {"TAILOR", "Tailor (दर्जी / ದರ್ಜಿ)", "🧵"},
            {"SECURITY_GUARD", "Security Guard (सुरक्षा गार्ड / ಸೆಕ್ಯೂರಿಟಿ)", "👮"}
        };

        for (String[] cat : categoryData) {
            Map<String, Object> c = new HashMap<>();
            c.put("id", cat[0]);
            c.put("code", cat[0]);
            c.put("name", cat[1]);
            c.put("icon", cat[2]);
            c.put("active", true);
            CATEGORIES_LIST.add(c);
        }
    }

    private static void initSeedJobs() {
        // CARPENTER Jobs across multiple cities
        createJob("job_carp_1", "Wood Carpenter (ಮರಗೆಲಸ / Carpenter)", "CARPENTER", "Mysuru Furniture Works", "emp_3",
                "Bengaluru", 12.9716, 77.5946, 1200, 1500, "DAILY", "3 years", 2, "Immediate joining",
                "Furniture making & repair work in Bengaluru. Daily wages provided.", "ACTIVE");

        createJob("job_carp_2", "Furniture Carpenter (ಬಡಗಿ ಕೆಲಸ)", "CARPENTER", "Karnataka Wood Crafts", "emp_31",
                "Mysuru", 12.2958, 76.6394, 1000, 1200, "DAILY", "2 years", 3, "Immediate",
                "Custom wooden door and table assembly work in Mysuru.", "ACTIVE");

        createJob("job_carp_3", "Interior Carpenter (कारपेंटर)", "CARPENTER", "Coastal Interiors", "emp_32",
                "Mangaluru", 12.9141, 74.8560, 1100, 1400, "DAILY", "2 years", 2, "Immediate",
                "Plywood and kitchen cabinet installation work in Mangaluru.", "ACTIVE");

        createJob("job_carp_4", "Shuttering Carpenter (ಮರಗೆಲಸ ಕೆಲಸ)", "CARPENTER", "Hubballi Infra Ltd", "emp_33",
                "Hubballi", 15.3647, 75.1240, 950, 1150, "DAILY", "1 year", 4, "Immediate",
                "Building construction framework carpenter work in Hubballi.", "ACTIVE");

        // DRIVER Jobs
        createJob("job_drv_1", "Personal Car Driver (गाड़ी ड्राइवर)", "DRIVER", "Sharma Household", "emp_1",
                "Bengaluru", 12.9716, 77.5946, 18000, 22000, "MONTHLY", "5 years", 1, "Immediate",
                "Car driving job in Bengaluru. Valid Driving License required. Meals provided daily.", "ACTIVE");

        createJob("job_drv_2", "Commercial Van Driver (ಚಾಲಕ)", "DRIVER", "Mysuru Logistics", "emp_11",
                "Mysuru", 12.2958, 76.6394, 16000, 19000, "MONTHLY", "2 years", 2, "Immediate",
                "Goods delivery van driver job in Mysuru local areas.", "ACTIVE");

        createJob("job_drv_3", "Auto Taxi Driver (ಟ್ಯಾಕ್ಸಿ ಡ್ರೈವರ್)", "DRIVER", "Coastal Cabs", "emp_12",
                "Mangaluru", 12.9141, 74.8560, 700, 900, "DAILY", "1 year", 3, "Immediate",
                "City cab driver job in Mangaluru.", "ACTIVE");

        // PAINTER Jobs
        createJob("job_pnt_1", "House Painter (ಪೇಂಟರ್ ಕೆಲಸ)", "PAINTER", "Bengaluru Paints & Decor", "emp_2",
                "Bengaluru", 12.9352, 77.6245, 900, 1100, "DAILY", "2 years", 3, "Today",
                "Wall painting work in Koramangala, Bengaluru. Daily payment at 6 PM.", "ACTIVE");

        createJob("job_pnt_2", "Wall Painter (पेंटर)", "PAINTER", "Heritage Painters", "emp_21",
                "Mysuru", 12.2958, 76.6394, 950, 1150, "DAILY", "2 years", 2, "Immediate",
                "Interior & exterior house painting work in Mysuru.", "ACTIVE");

        // ELECTRICIAN Jobs
        createJob("job_elec_1", "Electrician Helper (ಇಲೆಕ್ಟ್ರೀಷಿಯನ್)", "ELECTRICIAN", "PowerGrid Services", "emp_4",
                "Bengaluru", 12.9279, 77.5824, 1000, 1300, "DAILY", "1 year", 2, "Immediate",
                "Electrical wiring and fixture installation in Jayanagar, Bengaluru.", "ACTIVE");

        createJob("job_elec_2", "Wiring Electrician (इलेक्ट्रीशियन)", "ELECTRICIAN", "Mysuru Electric", "emp_41",
                "Mysuru", 12.2958, 76.6394, 1200, 1400, "DAILY", "3 years", 1, "Immediate",
                "Residential electrical maintenance work in Mysuru.", "ACTIVE");

        // PLUMBER Jobs
        createJob("job_plmb_1", "Plumbing Worker (ಪ್ಲಂಬರ್)", "PLUMBER", "City Water Solutions", "emp_5",
                "Bengaluru", 12.9784, 77.6408, 1000, 1200, "DAILY", "2 years", 1, "Immediate",
                "Pipe fixing and tap installation work in Indiranagar, Bengaluru.", "ACTIVE");

        // MASON Jobs
        createJob("job_msn_1", "Building Mason (ಮೇಸ್ತ್ರಿ ಕಾಮಗಾರಿ)", "MASON", "Tumakuru Builders", "emp_6",
                "Tumakuru", 13.3379, 77.1173, 900, 1100, "DAILY", "3 years", 4, "Immediate",
                "Construction masonry work. Accommodation facility available.", "ACTIVE");

        // COOK Jobs
        createJob("job_cook_1", "Home Cook / Chef (ರಸೋಯಿ ಅಡುಗೆಕಾರ್)", "COOK", "Verma Family", "emp_7",
                "Noida", 28.5355, 77.3910, 16000, 20000, "MONTHLY", "2 years", 1, "Immediate",
                "North & South Indian cooking for family. Morning and evening shift.", "ACTIVE");

        createJob("job_cook_2", "Restaurant Helper Cook (अधूरी रसोई)", "COOK", "South Tiffin Room", "emp_71",
                "Bengaluru", 12.9716, 77.5946, 18000, 22000, "MONTHLY", "1 year", 2, "Immediate",
                "Tiffin room cook assistant in Bengaluru.", "ACTIVE");

        // CLEANER Jobs
        createJob("job_cln_1", "House Cleaner & Maid (ಸಫಾಯಿ)", "CLEANER", "Royal Apartments", "emp_8",
                "Bengaluru", 12.9698, 77.7500, 14000, 17000, "MONTHLY", "Any", 2, "Immediate",
                "House cleaning & washing work in Whitefield, Bengaluru. Sunday off.", "ACTIVE");

        // MECHANIC Jobs
        createJob("job_mech_1", "Auto Bike Mechanic (ಮೆಕ್ಯಾನಿಕ್)", "MECHANIC", "Express Garage", "emp_9",
                "Bengaluru", 12.9716, 77.5946, 16000, 20000, "MONTHLY", "2 years", 2, "Immediate",
                "Two-wheeler and bike servicing mechanic in Bengaluru.", "ACTIVE");

        // WELDER Jobs
        createJob("job_wld_1", "Fabrication Welder (ವೇಲ್ಡರ್)", "WELDER", "Mysuru Steel Works", "emp_10",
                "Mysuru", 12.2958, 76.6394, 1100, 1300, "DAILY", "2 years", 2, "Immediate",
                "Iron gate and grill welding work in Mysuru.", "ACTIVE");

        // SECURITY GUARD Jobs
        createJob("job_sec_1", "Apartment Security Guard (ಸೆಕ್ಯೂರಿಟಿ)", "SECURITY_GUARD", "SecureShield", "emp_13",
                "Bengaluru", 12.9716, 77.5946, 16000, 18000, "MONTHLY", "1 year", 4, "Immediate",
                "12-hour shift security guard work for gated apartment in Bengaluru.", "ACTIVE");

        // DELIVERY WORKER Jobs
        createJob("job_dlv_1", "Express Delivery Rider (ಡೆಲಿವರಿ)", "DELIVERY_WORKER", "QuickParcel", "emp_14",
                "Mysuru", 12.2958, 76.6394, 18000, 22000, "MONTHLY", "6 months", 5, "Immediate",
                "Package delivery rider with bike in Mysuru.", "ACTIVE");
    }

    private static void createJob(String id, String title, String category, String employerName, String employerId,
                                  String location, double lat, double lng, int minSalary, int maxSalary,
                                  String salaryType, String experience, int required, String joining, String desc, String status) {
        Map<String, Object> job = new HashMap<>();
        job.put("id", id);
        job.put("title", title);
        job.put("category", category);
        job.put("employerName", employerName);
        job.put("employerId", employerId);
        job.put("location", location);
        job.put("latitude", lat);
        job.put("longitude", lng);
        job.put("minSalary", minSalary);
        job.put("maxSalary", maxSalary);
        job.put("salaryType", salaryType);
        job.put("experience", experience);
        job.put("workersRequired", required);
        job.put("joiningDate", joining);
        job.put("description", desc);
        job.put("status", status);
        job.put("postedDate", System.currentTimeMillis());
        JOBS_DB.put(id, job);
    }

    // --- Health & Test ---
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "VoiceHire Backend for Low-Literacy Workers");
    }

    @GetMapping("/test")
    public Map<String, Object> test() {
        return Map.of("status", "Backend is working!", "message", "VoiceHire Low-Literacy Worker API Active", "timestamp", System.currentTimeMillis());
    }

    // --- Auth Endpoints ---
    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        String email = (String) body.get("email");
        String name = (String) body.get("name");
        if (name == null || name.isEmpty()) {
            name = ((String) body.getOrDefault("firstName", "")) + " " + ((String) body.getOrDefault("lastName", ""));
            name = name.trim();
        }
        String phoneNumber = (String) body.get("phoneNumber");
        String role = (String) body.getOrDefault("role", "WORKER");
        String preferredLanguage = (String) body.getOrDefault("preferredLanguage", "kn-IN");
        String skill = (String) body.getOrDefault("skill", "DRIVER");

        String userId = "user_" + UUID.randomUUID().toString().substring(0, 8);
        Map<String, Object> user = new HashMap<>(body);
        user.put("id", userId);
        user.put("name", name.isEmpty() ? "Worker" : name);
        user.put("role", role);
        user.put("preferredLanguage", preferredLanguage);
        user.put("skill", skill);

        if (email != null && !email.isEmpty()) USERS_DB.put(email.toLowerCase(), user);
        if (phoneNumber != null && !phoneNumber.isEmpty()) USERS_DB.put(phoneNumber, user);
        USERS_DB.put(userId, user);

        response.put("success", true);
        response.put("message", "Registration successful!");
        response.put("token", "jwt_" + userId);
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        String emailOrPhone = (String) body.get("email");
        if (emailOrPhone == null) emailOrPhone = (String) body.get("phoneNumber");

        Map<String, Object> user = null;
        if (emailOrPhone != null) {
            user = USERS_DB.get(emailOrPhone.toLowerCase());
        }

        if (user == null) {
            user = new HashMap<>();
            user.put("id", "user_demo");
            user.put("name", "Ramesh Worker");
            user.put("email", emailOrPhone != null ? emailOrPhone : "ramesh@voicehire.org");
            user.put("phoneNumber", "9876543210");
            user.put("role", "WORKER");
            user.put("preferredLanguage", "kn-IN");
            user.put("skill", "DRIVER");
        }

        response.put("success", true);
        response.put("message", "Login successful!");
        response.put("token", "jwt_" + user.get("id"));
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    // --- Job Categories Endpoints ---
    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getCategories() {
        return ResponseEntity.ok(CATEGORIES_LIST);
    }

    @PostMapping("/categories")
    public ResponseEntity<Map<String, Object>> addCategory(@RequestBody Map<String, Object> category) {
        String code = (String) category.get("code");
        if (code != null) {
            code = code.toUpperCase();
            ALLOWED_CATEGORIES.add(code);
            category.put("id", code);
            CATEGORIES_LIST.add(category);
        }
        return ResponseEntity.ok(Map.of("success", true, "category", category));
    }

    // --- Jobs Endpoints ---
    @GetMapping("/jobs")
    public ResponseEntity<List<Map<String, Object>>> getJobs(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status) {

        List<Map<String, Object>> result = new ArrayList<>(JOBS_DB.values());

        // Default status filter to ACTIVE unless explicitly overridden
        final String targetStatus = (status != null && !status.isEmpty()) ? status.toUpperCase() : "ACTIVE";
        if (!"ALL".equalsIgnoreCase(targetStatus)) {
            result = result.stream()
                    .filter(j -> targetStatus.equalsIgnoreCase((String) j.get("status")))
                    .collect(Collectors.toList());
        }

        if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("ALL")) {
            final String catFilter = category.toUpperCase();
            result = result.stream()
                    .filter(j -> catFilter.equalsIgnoreCase((String) j.get("category")))
                    .collect(Collectors.toList());
        }

        if (keyword != null && !keyword.isEmpty()) {
            final String kw = keyword.toLowerCase();
            result = result.stream()
                    .filter(j -> ((String) j.get("title")).toLowerCase().contains(kw) ||
                                 ((String) j.get("description")).toLowerCase().contains(kw) ||
                                 ((String) j.get("category")).toLowerCase().contains(kw))
                    .collect(Collectors.toList());
        }

        if (location != null && !location.isEmpty()) {
            final String loc = location.toLowerCase();
            result = result.stream()
                    .filter(j -> ((String) j.get("location")).toLowerCase().contains(loc))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/jobs/nearby")
    public ResponseEntity<List<Map<String, Object>>> getNearbyJobs(
            @RequestParam(defaultValue = "12.9716") double lat,
            @RequestParam(defaultValue = "77.5946") double lng) {

        List<Map<String, Object>> result = new ArrayList<>(JOBS_DB.values());
        result = result.stream().filter(j -> "ACTIVE".equalsIgnoreCase((String) j.get("status"))).collect(Collectors.toList());

        for (Map<String, Object> job : result) {
            double jLat = (double) job.getOrDefault("latitude", 12.9716);
            double jLng = (double) job.getOrDefault("longitude", 77.5946);
            double dist = calculateDistanceKm(lat, lng, jLat, jLng);
            job.put("distanceKm", Math.round(dist * 10.0) / 10.0);
        }

        result.sort((a, b) -> Double.compare((Double) a.get("distanceKm"), (Double) b.get("distanceKm")));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<Map<String, Object>> getJobById(@PathVariable String id) {
        Map<String, Object> job = JOBS_DB.get(id);
        if (job == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Job not found"));
        }
        return ResponseEntity.ok(job);
    }

    @PostMapping("/jobs")
    public ResponseEntity<Map<String, Object>> createJob(@RequestBody Map<String, Object> jobData) {
        String category = (String) jobData.get("category");
        if (category != null) category = category.toUpperCase();

        // Enforce Low-Literacy Skilled Categories Only
        if (category == null || !ALLOWED_CATEGORIES.contains(category)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "message", "Invalid category. Professional/corporate jobs are not allowed on VoiceHire."
            ));
        }

        String jobId = "job_" + UUID.randomUUID().toString().substring(0, 8);
        jobData.put("id", jobId);
        jobData.put("category", category);
        jobData.put("status", "ACTIVE");
        jobData.put("postedDate", System.currentTimeMillis());
        JOBS_DB.put(jobId, jobData);

        return ResponseEntity.ok(Map.of("success", true, "job", jobData));
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<Map<String, Object>> updateJob(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Map<String, Object> job = JOBS_DB.get(id);
        if (job == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Job not found"));
        }
        job.putAll(updates);
        return ResponseEntity.ok(Map.of("success", true, "job", job));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Map<String, Object>> deleteJob(@PathVariable String id) {
        JOBS_DB.remove(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Job deleted"));
    }

    // --- Applications Endpoints & Duplicate Prevention ---
    @PostMapping("/applications")
    public ResponseEntity<Map<String, Object>> createApplication(@RequestBody Map<String, Object> body) {
        String jobId = (String) body.get("jobId");
        String workerId = (String) body.getOrDefault("workerId", "worker_1");
        String workerName = (String) body.getOrDefault("workerName", "Ramesh");
        String applicationSource = (String) body.getOrDefault("applicationSource", "MANUAL");
        if (applicationSource != null) applicationSource = applicationSource.toUpperCase();

        if (jobId == null || !JOBS_DB.containsKey(jobId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", "Invalid jobId"));
        }

        Map<String, Object> job = JOBS_DB.get(jobId);

        // Duplicate Check: Check if worker has already applied for this jobId
        for (Map<String, Object> app : APPLICATIONS_DB.values()) {
            if (jobId.equals(app.get("jobId")) && workerId.equals(app.get("workerId"))) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "success", false,
                    "alreadyApplied", true,
                    "message", "You have already applied for this job."
                ));
            }
        }

        String appId = "app_" + UUID.randomUUID().toString().substring(0, 8);
        Map<String, Object> app = new HashMap<>();
        app.put("id", appId);
        app.put("jobId", jobId);
        app.put("jobTitle", job.get("title"));
        app.put("employerName", job.get("employerName"));
        app.put("location", job.get("location"));
        app.put("category", job.get("category"));
        app.put("minSalary", job.get("minSalary"));
        app.put("maxSalary", job.get("maxSalary"));
        app.put("salaryType", job.get("salaryType"));
        app.put("workerId", workerId);
        app.put("workerName", workerName);
        app.put("applicationSource", applicationSource);
        app.put("status", "UNDER_REVIEW");
        app.put("appliedAt", System.currentTimeMillis());
        app.put("updatedAt", System.currentTimeMillis());

        APPLICATIONS_DB.put(appId, app);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Application submitted successfully!",
            "application", app
        ));
    }

    @GetMapping("/applications/my")
    public ResponseEntity<List<Map<String, Object>>> getMyApplications(
            @RequestParam(defaultValue = "worker_1") String workerId,
            @RequestParam(required = false) String applicationSource) {
        
        List<Map<String, Object>> result = APPLICATIONS_DB.values().stream()
                .filter(a -> workerId.equals(a.get("workerId")))
                .collect(Collectors.toList());

        if (applicationSource != null && !applicationSource.isEmpty() && !"ALL".equalsIgnoreCase(applicationSource)) {
            final String srcFilter = applicationSource.toUpperCase();
            result = result.stream()
                    .filter(a -> srcFilter.equalsIgnoreCase((String) a.get("applicationSource")))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/applications/worker/{workerId}")
    public ResponseEntity<List<Map<String, Object>>> getWorkerApplications(
            @PathVariable String workerId,
            @RequestParam(required = false) String applicationSource) {
        return getMyApplications(workerId, applicationSource);
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<Map<String, Object>> getApplicationById(@PathVariable String id) {
        Map<String, Object> app = APPLICATIONS_DB.get(id);
        if (app == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Application not found"));
        return ResponseEntity.ok(app);
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<Map<String, Object>> updateAppStatus(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Map<String, Object> app = APPLICATIONS_DB.get(id);
        if (app == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Application not found"));
        
        String newStatus = (String) body.get("status");
        if (newStatus != null) {
            app.put("status", newStatus);
            app.put("updatedAt", System.currentTimeMillis());
        }
        return ResponseEntity.ok(Map.of("success", true, "application", app));
    }

    // --- Worker Profile Endpoints ---
    @GetMapping("/workers/profile")
    public ResponseEntity<Map<String, Object>> getWorkerProfile(@RequestParam(defaultValue = "worker_1") String id) {
        Map<String, Object> profile = USERS_DB.getOrDefault(id, Map.of(
            "id", id,
            "name", "Ramesh Worker",
            "phoneNumber", "9876543210",
            "preferredLanguage", "kn-IN",
            "skill", "DRIVER",
            "experience", "5 years",
            "location", "Bengaluru"
        ));
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/workers/profile")
    public ResponseEntity<Map<String, Object>> updateWorkerProfile(@RequestBody Map<String, Object> body) {
        String id = (String) body.getOrDefault("id", "worker_1");
        Map<String, Object> existing = USERS_DB.getOrDefault(id, new HashMap<>());
        existing.putAll(body);
        existing.put("id", id);
        USERS_DB.put(id, existing);
        return ResponseEntity.ok(Map.of("success", true, "profile", existing));
    }

    // --- Distance Helper ---
    private static double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of Earth in KM
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
