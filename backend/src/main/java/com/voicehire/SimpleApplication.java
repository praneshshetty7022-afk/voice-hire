package com.voicehire;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.bson.Document;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import jakarta.annotation.PostConstruct;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@SpringBootApplication(exclude = {
    SecurityAutoConfiguration.class
})
@RestController
@RequestMapping
public class SimpleApplication {

    @Value("${cors.allowed-origins:*}")
    private String corsAllowedOrigins;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                if ("*".equals(corsAllowedOrigins.trim())) {
                    registry.addMapping("/**")
                            .allowedOriginPatterns("*")
                            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                            .allowedHeaders("*")
                            .allowCredentials(true);
                } else {
                    String[] origins = Arrays.stream(corsAllowedOrigins.split(","))
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .toArray(String[]::new);
                    registry.addMapping("/**")
                            .allowedOrigins(origins)
                            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                            .allowedHeaders("*")
                            .allowCredentials(true);
                }
            }
        };
    }

    @Autowired(required = false)
    private MongoTemplate mongoTemplate;

    private volatile boolean isMongoConnected = false;

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
        initSeedUsers();
        initSeedApplications();
        SpringApplication.run(SimpleApplication.class, args);
        System.out.println("✅ Udyoga Mitra Backend active on port 8082!");
    }

    private static void initSeedApplications() {
        Map<String, Object> app1 = new HashMap<>();
        app1.put("id", "app_seed_1");
        app1.put("applicationId", "app_seed_1");
        app1.put("jobId", "job_carp_1");
        app1.put("jobTitle", "Wood Carpenter (ಮರಗೆಲಸ / Carpenter)");
        app1.put("employerId", "emp_3");
        app1.put("employerName", "Mysuru Furniture Works");
        app1.put("jobLocation", "Bengaluru");
        app1.put("location", "Bengaluru");
        app1.put("category", "CARPENTER");
        app1.put("minSalary", 1200);
        app1.put("maxSalary", 1500);
        app1.put("salaryType", "DAILY");
        app1.put("workerId", "worker_1");
        app1.put("workerName", "Pranesh");
        app1.put("workerPhone", "9876543210");
        app1.put("experience", "3 Years");
        app1.put("applicationSource", "VOICE");
        app1.put("voiceTranscript", "My name is Pranesh. I have 3 years experience in furniture wood carpentry.");
        app1.put("status", "APPLIED");
        app1.put("appliedAt", System.currentTimeMillis() - 3600000);
        APPLICATIONS_DB.put("app_seed_1", app1);

        Map<String, Object> app2 = new HashMap<>();
        app2.put("id", "app_seed_2");
        app2.put("applicationId", "app_seed_2");
        app2.put("jobId", "job_drv_1");
        app2.put("jobTitle", "Personal Car Driver (गाड़ी ड्राइवर)");
        app2.put("employerId", "emp_1");
        app2.put("employerName", "Sharma Household");
        app2.put("jobLocation", "Bengaluru");
        app2.put("location", "Bengaluru");
        app2.put("category", "DRIVER");
        app2.put("minSalary", 18000);
        app2.put("maxSalary", 22000);
        app2.put("salaryType", "MONTHLY");
        app2.put("workerId", "worker_1");
        app2.put("workerName", "Pranesh");
        app2.put("workerPhone", "9876543210");
        app2.put("experience", "5 Years");
        app2.put("applicationSource", "MANUAL");
        app2.put("status", "ACCEPTED");
        app2.put("appliedAt", System.currentTimeMillis() - 7200000);
        app2.put("approvedAt", System.currentTimeMillis() - 1800000);
        APPLICATIONS_DB.put("app_seed_2", app2);
    }

    private static void initSeedUsers() {
        // Default approved worker (for main demo workflow)
        Map<String, Object> w1 = new HashMap<>();
        w1.put("id", "worker_1");
        w1.put("name", "Pranesh");
        w1.put("email", "pranesh@voicehire.org");
        w1.put("phoneNumber", "9876543210");
        w1.put("role", "WORKER");
        w1.put("location", "Bengaluru");
        w1.put("skill", "Carpenter");
        w1.put("skills", "Carpenter");
        w1.put("experience", "2 Years");
        w1.put("preferredJob", "Carpenter");
        w1.put("preferredLocation", "Bengaluru");
        w1.put("preferredLanguage", "kn-IN");
        w1.put("accountStatus", "APPROVED");
        w1.put("registeredDate", "26 Sep 2026");
        w1.put("registeredAt", System.currentTimeMillis() - 86400000);
        USERS_DB.put("worker_1", w1);
        USERS_DB.put("9876543210", w1);

        // Pending worker 1
        Map<String, Object> w2 = new HashMap<>();
        w2.put("id", "worker_pending_1");
        w2.put("name", "Ramesh Kumar");
        w2.put("email", "ramesh.kumar@example.com");
        w2.put("phoneNumber", "9812345678");
        w2.put("role", "WORKER");
        w2.put("location", "Bengaluru");
        w2.put("skill", "Driver");
        w2.put("skills", "Driver (गाड़ी ड्राइवर)");
        w2.put("experience", "3 Years");
        w2.put("preferredJob", "Personal Car Driver");
        w2.put("preferredLocation", "Bengaluru");
        w2.put("preferredLanguage", "hi-IN");
        w2.put("accountStatus", "PENDING");
        w2.put("registeredDate", "26 Sep 2026");
        w2.put("registeredAt", System.currentTimeMillis() - 3600000);
        USERS_DB.put("worker_pending_1", w2);
        USERS_DB.put("9812345678", w2);

        // Pending worker 2
        Map<String, Object> w3 = new HashMap<>();
        w3.put("id", "worker_pending_2");
        w3.put("name", "Suresh Gowda");
        w3.put("email", "suresh.g@example.com");
        w3.put("phoneNumber", "9876501234");
        w3.put("role", "WORKER");
        w3.put("location", "Mysuru");
        w3.put("skill", "Carpenter");
        w3.put("skills", "Furniture Carpenter");
        w3.put("experience", "2 Years");
        w3.put("preferredJob", "Wood Carpenter");
        w3.put("preferredLocation", "Mysuru");
        w3.put("preferredLanguage", "kn-IN");
        w3.put("accountStatus", "PENDING");
        w3.put("registeredDate", "26 Sep 2026");
        w3.put("registeredAt", System.currentTimeMillis() - 7200000);
        USERS_DB.put("worker_pending_2", w3);
        USERS_DB.put("9876501234", w3);

        // Admin User
        Map<String, Object> admin = new HashMap<>();
        admin.put("id", "admin_1");
        admin.put("name", "System Admin");
        admin.put("email", "admin@voicehire.org");
        admin.put("role", "ADMIN");
        admin.put("accountStatus", "APPROVED");
        USERS_DB.put("admin_1", admin);
        USERS_DB.put("admin@voicehire.org", admin);
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

    // --- MongoDB Atlas Synchronization & Persistence Layer ---
    @PostConstruct
    public void initMongo() {
        if (mongoTemplate != null) {
            try {
                mongoTemplate.getDb().runCommand(new Document("ping", 1));
                isMongoConnected = true;
                System.out.println("✅ Connected to MongoDB: " + mongoTemplate.getDb().getName());
                syncDataFromMongo();
            } catch (Exception e) {
                System.out.println("⚠️ MongoDB Atlas connection check (" + e.getMessage() + "). Running with in-memory fallback.");
                isMongoConnected = false;
            }
        } else {
            System.out.println("ℹ️ MongoTemplate not initialized. Running with in-memory fallback.");
        }
    }

    private synchronized void syncDataFromMongo() {
        if (!isMongoConnected || mongoTemplate == null) return;
        try {
            // 1. Sync Users
            List<Document> userDocs = mongoTemplate.findAll(Document.class, "users");
            if (userDocs.isEmpty()) {
                for (Map<String, Object> user : new HashSet<>(USERS_DB.values())) {
                    Document doc = new Document(user);
                    if (user.containsKey("id")) doc.put("_id", user.get("id"));
                    mongoTemplate.save(doc, "users");
                }
            } else {
                for (Document doc : userDocs) {
                    Map<String, Object> map = new HashMap<>(doc);
                    String id = (String) map.get("id");
                    if (id == null && doc.get("_id") != null) id = String.valueOf(doc.get("_id"));
                    if (id != null) {
                        map.put("id", id);
                        USERS_DB.put(id, map);
                        String email = (String) map.get("email");
                        if (email != null && !email.isEmpty()) USERS_DB.put(email.toLowerCase(), map);
                        String phone = (String) map.get("phoneNumber");
                        if (phone != null && !phone.isEmpty()) USERS_DB.put(phone, map);
                    }
                }
            }

            // 2. Sync Jobs
            List<Document> jobDocs = mongoTemplate.findAll(Document.class, "jobs");
            if (jobDocs.isEmpty()) {
                for (Map<String, Object> job : JOBS_DB.values()) {
                    Document doc = new Document(job);
                    if (job.containsKey("id")) doc.put("_id", job.get("id"));
                    mongoTemplate.save(doc, "jobs");
                }
            } else {
                for (Document doc : jobDocs) {
                    Map<String, Object> map = new HashMap<>(doc);
                    String id = (String) map.get("id");
                    if (id == null && doc.get("_id") != null) id = String.valueOf(doc.get("_id"));
                    if (id != null) {
                        map.put("id", id);
                        JOBS_DB.put(id, map);
                    }
                }
            }

            // 3. Sync Applications
            List<Document> appDocs = mongoTemplate.findAll(Document.class, "applications");
            if (appDocs.isEmpty()) {
                for (Map<String, Object> app : APPLICATIONS_DB.values()) {
                    Document doc = new Document(app);
                    if (app.containsKey("id")) doc.put("_id", app.get("id"));
                    mongoTemplate.save(doc, "applications");
                }
            } else {
                for (Document doc : appDocs) {
                    Map<String, Object> map = new HashMap<>(doc);
                    String id = (String) map.get("id");
                    if (id == null && doc.get("_id") != null) id = String.valueOf(doc.get("_id"));
                    if (id != null) {
                        map.put("id", id);
                        APPLICATIONS_DB.put(id, map);
                    }
                }
            }

            // 4. Sync Categories
            List<Document> catDocs = mongoTemplate.findAll(Document.class, "categories");
            if (catDocs.isEmpty()) {
                for (Map<String, Object> cat : CATEGORIES_LIST) {
                    Document doc = new Document(cat);
                    if (cat.containsKey("id")) doc.put("_id", cat.get("id"));
                    mongoTemplate.save(doc, "categories");
                }
            } else {
                CATEGORIES_LIST.clear();
                for (Document doc : catDocs) {
                    Map<String, Object> map = new HashMap<>(doc);
                    CATEGORIES_LIST.add(map);
                    String code = (String) map.get("code");
                    if (code != null) ALLOWED_CATEGORIES.add(code.toUpperCase());
                }
            }
            System.out.println("✅ Synchronized with MongoDB (Users: " + USERS_DB.size() + ", Jobs: " + JOBS_DB.size() + ", Applications: " + APPLICATIONS_DB.size() + ")");
        } catch (Exception e) {
            System.err.println("⚠️ MongoDB synchronization notice: " + e.getMessage());
        }
    }

    private void persistUser(Map<String, Object> user) {
        if (!isMongoConnected || mongoTemplate == null || user == null) return;
        try {
            Document doc = new Document(user);
            String id = (String) user.get("id");
            if (id != null) doc.put("_id", id);
            mongoTemplate.save(doc, "users");
        } catch (Exception e) {
            System.err.println("Failed to persist user to MongoDB: " + e.getMessage());
        }
    }

    private void persistJob(Map<String, Object> job) {
        if (!isMongoConnected || mongoTemplate == null || job == null) return;
        try {
            Document doc = new Document(job);
            String id = (String) job.get("id");
            if (id != null) doc.put("_id", id);
            mongoTemplate.save(doc, "jobs");
        } catch (Exception e) {
            System.err.println("Failed to persist job to MongoDB: " + e.getMessage());
        }
    }

    private void deleteJobFromMongo(String jobId) {
        if (!isMongoConnected || mongoTemplate == null || jobId == null) return;
        try {
            mongoTemplate.remove(Query.query(Criteria.where("_id").is(jobId)), "jobs");
            mongoTemplate.remove(Query.query(Criteria.where("id").is(jobId)), "jobs");
        } catch (Exception e) {
            System.err.println("Failed to delete job from MongoDB: " + e.getMessage());
        }
    }

    private void persistApplication(Map<String, Object> app) {
        if (!isMongoConnected || mongoTemplate == null || app == null) return;
        try {
            Document doc = new Document(app);
            String id = (String) app.get("id");
            if (id != null) doc.put("_id", id);
            mongoTemplate.save(doc, "applications");
        } catch (Exception e) {
            System.err.println("Failed to persist application to MongoDB: " + e.getMessage());
        }
    }

    private void persistCategory(Map<String, Object> cat) {
        if (!isMongoConnected || mongoTemplate == null || cat == null) return;
        try {
            Document doc = new Document(cat);
            String id = (String) cat.get("id");
            if (id != null) doc.put("_id", id);
            mongoTemplate.save(doc, "categories");
        } catch (Exception e) {
            System.err.println("Failed to persist category to MongoDB: " + e.getMessage());
        }
    }

    // --- Health & Test ---
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "Udyoga Mitra Backend for Worker Employment");
    }

    @GetMapping("/test")
    public Map<String, Object> test() {
        return Map.of("status", "Backend is working!", "message", "Udyoga Mitra Worker API Active", "timestamp", System.currentTimeMillis());
    }

    // --- Auth Endpoints ---
    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody(required = false) Map<String, Object> bodyPayload) {
        Map<String, Object> body = bodyPayload != null ? bodyPayload : new HashMap<>();
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
        user.put("phoneNumber", phoneNumber != null ? phoneNumber : "98" + System.currentTimeMillis() % 100000000);
        user.put("preferredLanguage", preferredLanguage);
        user.put("skill", skill);
        user.put("skills", body.getOrDefault("skills", skill));
        user.put("location", body.getOrDefault("location", "Bengaluru"));
        user.put("experience", body.getOrDefault("experience", "2 Years"));
        user.put("preferredJob", body.getOrDefault("preferredJob", skill));
        user.put("preferredLocation", body.getOrDefault("preferredLocation", "Bengaluru"));
        user.put("accountStatus", "WORKER".equalsIgnoreCase(role) ? "PENDING" : "APPROVED");
        user.put("registeredDate", "26 Sep 2026");
        user.put("registeredAt", System.currentTimeMillis());

        if (email != null && !email.isEmpty()) USERS_DB.put(email.toLowerCase(), user);
        if (phoneNumber != null && !phoneNumber.isEmpty()) USERS_DB.put(phoneNumber, user);
        USERS_DB.put(userId, user);
        persistUser(user);

        response.put("success", true);
        response.put("message", "Registration submitted! Your account is pending admin approval.");
        response.put("token", "jwt_" + userId);
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody(required = false) Map<String, Object> bodyPayload) {
        Map<String, Object> body = bodyPayload != null ? bodyPayload : new HashMap<>();
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
            user.put("accountStatus", "APPROVED");
        }

        if (!user.containsKey("accountStatus")) {
            user.put("accountStatus", "APPROVED");
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
            persistCategory(category);
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
                "message", "Invalid category. Professional/corporate jobs are not allowed on Udyoga Mitra."
            ));
        }

        String jobId = "job_" + UUID.randomUUID().toString().substring(0, 8);
        jobData.put("id", jobId);
        jobData.put("category", category);
        jobData.put("status", "ACTIVE");
        jobData.put("postedDate", System.currentTimeMillis());
        JOBS_DB.put(jobId, jobData);
        persistJob(jobData);

        return ResponseEntity.ok(Map.of("success", true, "job", jobData));
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<Map<String, Object>> updateJob(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Map<String, Object> job = JOBS_DB.get(id);
        if (job == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Job not found"));
        }
        job.putAll(updates);
        persistJob(job);
        return ResponseEntity.ok(Map.of("success", true, "job", job));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Map<String, Object>> deleteJob(@PathVariable String id) {
        JOBS_DB.remove(id);
        deleteJobFromMongo(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Job deleted"));
    }

    // --- Applications Endpoints & Job Application Tracking ---
    @PostMapping("/applications")
    public ResponseEntity<Map<String, Object>> createApplication(@RequestBody(required = false) Map<String, Object> bodyPayload) {
        Map<String, Object> body = bodyPayload != null ? bodyPayload : new HashMap<>();
        String jobId = (String) body.get("jobId");
        String workerId = (String) body.getOrDefault("workerId", "worker_1");
        String workerName = (String) body.getOrDefault("workerName", body.getOrDefault("applicantName", "Worker"));
        String workerPhone = (String) body.getOrDefault("workerPhone", body.getOrDefault("phoneNumber", "9876543210"));
        String applicationSource = (String) body.getOrDefault("applicationSource", body.getOrDefault("applicationMode", "MANUAL"));
        if (applicationSource != null) applicationSource = applicationSource.toUpperCase();

        if (jobId == null || !JOBS_DB.containsKey(jobId)) {
            // Pick default active job if jobId is unspecified
            jobId = JOBS_DB.keySet().stream().findFirst().orElse("job_carp_1");
        }

        Map<String, Object> job = JOBS_DB.get(jobId);
        if (job == null) {
            job = Map.of(
                "title", "Wood Carpenter",
                "employerId", "emp_3",
                "employerName", "Mysuru Furniture Works",
                "location", "Bengaluru",
                "category", "CARPENTER",
                "minSalary", 1200,
                "maxSalary", 1500,
                "salaryType", "DAILY"
            );
        }
        String employerId = (String) job.getOrDefault("employerId", "emp_1");
        String employerName = (String) job.getOrDefault("employerName", "Verified Employer");

        // Duplicate Check: Check if worker has already applied for this jobId
        for (Map<String, Object> app : APPLICATIONS_DB.values()) {
            if (jobId.equals(app.get("jobId")) && workerId.equals(app.get("workerId"))) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "success", false,
                    "alreadyApplied", true,
                    "message", "You have already applied for this job.",
                    "application", app
                ));
            }
        }

        String experience = (String) body.getOrDefault("experience", "2 Years");
        String appId = "app_" + UUID.randomUUID().toString().substring(0, 8);
        Map<String, Object> app = new HashMap<>();
        app.put("id", appId);
        app.put("applicationId", appId);
        app.put("jobId", jobId);
        app.put("jobTitle", job.get("title"));
        app.put("employerId", employerId);
        app.put("employerName", employerName);
        app.put("jobLocation", job.get("location"));
        app.put("location", job.get("location"));
        app.put("category", job.get("category"));
        app.put("minSalary", job.get("minSalary"));
        app.put("maxSalary", job.get("maxSalary"));
        app.put("salaryType", job.get("salaryType"));
        app.put("workerId", workerId);
        app.put("workerName", workerName);
        app.put("workerPhone", workerPhone);
        app.put("applicantName", workerName);
        app.put("name", workerName);
        app.put("experience", experience);
        app.put("experienceYears", body.getOrDefault("experienceYears", 2));
        app.put("applicationSource", applicationSource);
        app.put("applicationMode", applicationSource);
        app.put("applicationMethod", applicationSource);
        app.put("voiceRecording", body.getOrDefault("voiceRecording", ""));
        app.put("voiceTranscript", body.getOrDefault("voiceTranscript", body.getOrDefault("transcript", "")));
        app.put("language", body.getOrDefault("language", "en-IN"));
        app.put("status", "APPLIED"); // Standard initial status
        app.put("appliedAt", System.currentTimeMillis());
        app.put("updatedAt", System.currentTimeMillis());

        APPLICATIONS_DB.put(appId, app);
        persistApplication(app);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Application submitted successfully!",
            "application", app
        ));
    }

    @PostMapping("/applications/voice")
    public ResponseEntity<Map<String, Object>> createVoiceApplication(@RequestBody Map<String, Object> body) {
        return createApplication(body);
    }

    @GetMapping("/applications/check")
    public ResponseEntity<Map<String, Object>> checkApplied(
            @RequestParam String jobId,
            @RequestParam String workerId) {
        for (Map<String, Object> app : APPLICATIONS_DB.values()) {
            if (jobId.equals(app.get("jobId")) && workerId.equals(app.get("workerId"))) {
                return ResponseEntity.ok(Map.of(
                    "applied", true,
                    "application", app
                ));
            }
        }
        return ResponseEntity.ok(Map.of("applied", false));
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

    @GetMapping("/employer/applications")
    public ResponseEntity<List<Map<String, Object>>> getEmployerApplications(
            @RequestParam(required = false) String employerId) {
        
        if (employerId != null && !employerId.isEmpty()) {
            List<Map<String, Object>> result = APPLICATIONS_DB.values().stream()
                    .filter(a -> employerId.equals(a.get("employerId")))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(result);
        }
        
        // Return all applications for employer management overview
        return ResponseEntity.ok(new ArrayList<>(APPLICATIONS_DB.values()));
    }

    @GetMapping("/applications/employer/{employerId}")
    public ResponseEntity<List<Map<String, Object>>> getApplicationsForEmployer(@PathVariable String employerId) {
        return getEmployerApplications(employerId);
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
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", "Status is required"));
        }

        newStatus = newStatus.toUpperCase();

        // Support legacy values if sent by older UI components
        if ("PENDING".equals(newStatus)) newStatus = "APPLIED";
        if ("SHORTLISTED".equals(newStatus)) newStatus = "INTERVIEW_SCHEDULED";
        if ("SELECTED".equals(newStatus)) newStatus = "HIRED";

        String currentStatus = (String) app.getOrDefault("status", "APPLIED");
        if ("PENDING".equals(currentStatus)) currentStatus = "APPLIED";

        // Status transition validation rules
        // APPLIED -> UNDER_REVIEW -> INTERVIEW_SCHEDULED -> HIRED
        // REJECTED can be reached from APPLIED, UNDER_REVIEW, INTERVIEW_SCHEDULED
        if (!isValidStatusTransition(currentStatus, newStatus)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "message", "Invalid status transition from " + currentStatus + " to " + newStatus
            ));
        }

        app.put("status", newStatus);
        app.put("updatedAt", System.currentTimeMillis());

        // Update interview details if provided
        if (body.containsKey("interviewDate")) app.put("interviewDate", body.get("interviewDate"));
        if (body.containsKey("interviewTime")) app.put("interviewTime", body.get("interviewTime"));
        if (body.containsKey("interviewMode")) app.put("interviewMode", body.get("interviewMode"));
        if (body.containsKey("interviewLocation")) app.put("interviewLocation", body.get("interviewLocation"));
        if (body.containsKey("employerMessage")) app.put("employerMessage", body.get("employerMessage"));
        persistApplication(app);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Application status updated to " + newStatus,
            "application", app
        ));
    }

    private static boolean isValidStatusTransition(String current, String next) {
        if (current.equals(next)) return true;
        if ("REJECTED".equals(current)) return false; // Cannot transition out of REJECTED

        switch (current) {
            case "APPLIED":
                return "UNDER_REVIEW".equals(next) || "REJECTED".equals(next);
            case "UNDER_REVIEW":
                return "INTERVIEW_SCHEDULED".equals(next) || "HIRED".equals(next) || "REJECTED".equals(next);
            case "INTERVIEW_SCHEDULED":
                return "HIRED".equals(next) || "REJECTED".equals(next);
            case "HIRED":
                return "REJECTED".equals(next);
            default:
                return true;
        }
    }

    // --- Worker Profile Endpoints ---
    @GetMapping("/workers/profile")
    public ResponseEntity<Map<String, Object>> getWorkerProfile(@RequestParam(required = false) String id) {
        String targetId = (id != null && !id.trim().isEmpty()) ? id : "worker_1";
        Map<String, Object> profile = USERS_DB.get(targetId);

        if (profile == null) {
            for (Map<String, Object> u : USERS_DB.values()) {
                String uId = (String) u.get("id");
                String uPhone = (String) u.get("phoneNumber");
                String uEmail = (String) u.get("email");
                if (targetId.equalsIgnoreCase(uId) || targetId.equalsIgnoreCase(uPhone) || targetId.equalsIgnoreCase(uEmail)) {
                    profile = u;
                    break;
                }
            }
        }

        if (profile == null) {
            profile = new HashMap<>();
            profile.put("id", targetId);
            profile.put("name", "Pranesh");
            profile.put("phoneNumber", "9876543210");
            profile.put("preferredLanguage", "kn-IN");
            profile.put("skill", "CARPENTER");
            profile.put("skills", "Carpenter");
            profile.put("experience", "2 Years");
            profile.put("location", "Bengaluru");
            profile.put("accountStatus", "APPROVED");
        }

        if (!profile.containsKey("accountStatus")) {
            profile.put("accountStatus", "APPROVED");
        }

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/workers/profile")
    public ResponseEntity<Map<String, Object>> updateWorkerProfile(@RequestBody Map<String, Object> body) {
        String id = (String) body.getOrDefault("id", "worker_1");
        Map<String, Object> existing = USERS_DB.getOrDefault(id, new HashMap<>());
        existing.putAll(body);
        existing.put("id", id);
        USERS_DB.put(id, existing);
        persistUser(existing);
        return ResponseEntity.ok(Map.of("success", true, "profile", existing));
    }

    // --- Admin Worker Registration Approval Endpoints ---
    @GetMapping("/admin/workers/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingWorkers() {
        List<Map<String, Object>> pending = USERS_DB.values().stream()
                .filter(u -> "WORKER".equalsIgnoreCase((String) u.getOrDefault("role", "WORKER")))
                .filter(u -> "PENDING".equalsIgnoreCase((String) u.getOrDefault("accountStatus", "PENDING")))
                .collect(Collectors.toMap(
                    u -> (String) u.get("id"),
                    u -> u,
                    (existing, replacement) -> existing
                ))
                .values().stream()
                .sorted((a, b) -> Long.compare(
                    ((Number) b.getOrDefault("registeredAt", 0L)).longValue(),
                    ((Number) a.getOrDefault("registeredAt", 0L)).longValue()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(pending);
    }

    @GetMapping("/admin/workers/all")
    public ResponseEntity<List<Map<String, Object>>> getAllWorkers() {
        List<Map<String, Object>> allWorkers = USERS_DB.values().stream()
                .filter(u -> "WORKER".equalsIgnoreCase((String) u.getOrDefault("role", "WORKER")))
                .collect(Collectors.toMap(
                    u -> (String) u.get("id"),
                    u -> u,
                    (existing, replacement) -> existing
                ))
                .values().stream()
                .collect(Collectors.toList());

        return ResponseEntity.ok(allWorkers);
    }

    @GetMapping("/admin/workers/{id}")
    public ResponseEntity<Map<String, Object>> getWorkerById(@PathVariable String id) {
        Map<String, Object> worker = USERS_DB.get(id);
        if (worker == null) {
            for (Map<String, Object> u : USERS_DB.values()) {
                if (id.equalsIgnoreCase((String) u.get("id")) || id.equalsIgnoreCase((String) u.get("phoneNumber")) || id.equalsIgnoreCase((String) u.get("email"))) {
                    worker = u;
                    break;
                }
            }
        }

        if (worker == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Worker not found"));
        }
        return ResponseEntity.ok(worker);
    }

    @RequestMapping(value = "/admin/workers/{id}/approve", method = {RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<Map<String, Object>> approveWorker(@PathVariable String id) {
        Map<String, Object> worker = USERS_DB.get(id);
        if (worker == null) {
            for (Map<String, Object> u : USERS_DB.values()) {
                if (id.equalsIgnoreCase((String) u.get("id")) || id.equalsIgnoreCase((String) u.get("phoneNumber")) || id.equalsIgnoreCase((String) u.get("email"))) {
                    worker = u;
                    break;
                }
            }
        }

        if (worker == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Worker not found"));
        }

        worker.put("accountStatus", "APPROVED");
        worker.put("approvedAt", System.currentTimeMillis());
        worker.remove("rejectionReason");

        String userId = (String) worker.get("id");
        String email = (String) worker.get("email");
        String phone = (String) worker.get("phoneNumber");

        if (userId != null) USERS_DB.put(userId, worker);
        if (email != null && !email.isEmpty()) USERS_DB.put(email.toLowerCase(), worker);
        if (phone != null && !phone.isEmpty()) USERS_DB.put(phone, worker);
        persistUser(worker);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Worker approved successfully.",
            "worker", worker
        ));
    }

    @RequestMapping(value = "/admin/workers/{id}/reject", method = {RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<Map<String, Object>> rejectWorker(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, Object> body,
            @RequestParam(required = false) String reasonParam) {

        Map<String, Object> worker = USERS_DB.get(id);
        if (worker == null) {
            for (Map<String, Object> u : USERS_DB.values()) {
                if (id.equalsIgnoreCase((String) u.get("id")) || id.equalsIgnoreCase((String) u.get("phoneNumber")) || id.equalsIgnoreCase((String) u.get("email"))) {
                    worker = u;
                    break;
                }
            }
        }

        if (worker == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Worker not found"));
        }

        String reason = "Profile information needs verification.";
        if (reasonParam != null && !reasonParam.trim().isEmpty()) {
            reason = reasonParam;
        } else if (body != null) {
            if (body.containsKey("reason")) reason = String.valueOf(body.get("reason"));
            else if (body.containsKey("rejectionReason")) reason = String.valueOf(body.get("rejectionReason"));
        }

        worker.put("accountStatus", "REJECTED");
        worker.put("rejectionReason", reason);
        worker.put("rejectedAt", System.currentTimeMillis());

        String userId = (String) worker.get("id");
        String email = (String) worker.get("email");
        String phone = (String) worker.get("phoneNumber");

        if (userId != null) USERS_DB.put(userId, worker);
        if (email != null && !email.isEmpty()) USERS_DB.put(email.toLowerCase(), worker);
        if (phone != null && !phone.isEmpty()) USERS_DB.put(phone, worker);
        persistUser(worker);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Worker application rejected.",
            "reason", reason,
            "worker", worker
        ));
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long pendingWorkers = USERS_DB.values().stream()
                .filter(u -> "WORKER".equalsIgnoreCase((String) u.getOrDefault("role", "WORKER")))
                .filter(u -> "PENDING".equalsIgnoreCase((String) u.getOrDefault("accountStatus", "")))
                .map(u -> (String) u.get("id"))
                .distinct()
                .count();

        long pendingApplications = APPLICATIONS_DB.values().stream()
                .filter(a -> "APPLIED".equalsIgnoreCase((String) a.getOrDefault("status", "APPLIED")) || "PENDING".equalsIgnoreCase((String) a.getOrDefault("status", "")))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("pendingWorkersCount", pendingWorkers);
        stats.put("pendingApplicationsCount", pendingApplications);
        stats.put("totalJobsCount", JOBS_DB.size());
        stats.put("totalCategoriesCount", CATEGORIES_LIST.size());
        stats.put("totalApplicationsCount", APPLICATIONS_DB.size());

        return ResponseEntity.ok(stats);
    }

    // --- Admin Job Application Approval Endpoints ---
    @GetMapping("/admin/applications")
    public ResponseEntity<List<Map<String, Object>>> getAdminApplications(@RequestParam(required = false) String status) {
        List<Map<String, Object>> apps = new ArrayList<>(APPLICATIONS_DB.values());
        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            final String filterStatus = status.toUpperCase();
            apps = apps.stream()
                    .filter(a -> filterStatus.equalsIgnoreCase((String) a.getOrDefault("status", "APPLIED")))
                    .collect(Collectors.toList());
        }
        apps.sort((a, b) -> Long.compare(
            ((Number) b.getOrDefault("appliedAt", 0L)).longValue(),
            ((Number) a.getOrDefault("appliedAt", 0L)).longValue()
        ));
        return ResponseEntity.ok(apps);
    }

    @RequestMapping(value = {"/admin/applications/{id}/approve", "/admin/applications/{id}/accept"}, method = {RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<Map<String, Object>> acceptApplication(@PathVariable String id) {
        Map<String, Object> app = APPLICATIONS_DB.get(id);
        if (app == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Application not found"));
        }

        app.put("status", "ACCEPTED");
        app.put("approvedAt", System.currentTimeMillis());
        app.put("updatedAt", System.currentTimeMillis());
        persistApplication(app);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Job application accepted successfully.",
            "application", app
        ));
    }

    @RequestMapping(value = "/admin/applications/{id}/reject", method = {RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<Map<String, Object>> rejectApplication(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, Object> body,
            @RequestParam(required = false) String reasonParam) {

        Map<String, Object> app = APPLICATIONS_DB.get(id);
        if (app == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Application not found"));
        }

        String reason = "Application does not meet job criteria.";
        if (reasonParam != null && !reasonParam.trim().isEmpty()) {
            reason = reasonParam;
        } else if (body != null) {
            if (body.containsKey("reason")) reason = String.valueOf(body.get("reason"));
            else if (body.containsKey("rejectionReason")) reason = String.valueOf(body.get("rejectionReason"));
        }

        app.put("status", "REJECTED");
        app.put("rejectionReason", reason);
        app.put("updatedAt", System.currentTimeMillis());
        persistApplication(app);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Job application rejected.",
            "reason", reason,
            "application", app
        ));
    }

    @GetMapping("/applications/accepted")
    public ResponseEntity<List<Map<String, Object>>> getAcceptedApplications(@RequestParam(required = false) String workerId) {
        List<Map<String, Object>> accepted = APPLICATIONS_DB.values().stream()
                .filter(a -> {
                    String st = (String) a.getOrDefault("status", "");
                    return "ACCEPTED".equalsIgnoreCase(st) || "APPROVED".equalsIgnoreCase(st) || "HIRED".equalsIgnoreCase(st);
                })
                .collect(Collectors.toList());

        if (workerId != null && !workerId.isEmpty() && !"ALL".equalsIgnoreCase(workerId)) {
            accepted = accepted.stream()
                    .filter(a -> workerId.equalsIgnoreCase((String) a.get("workerId")))
                    .collect(Collectors.toList());
        }

        accepted.sort((a, b) -> Long.compare(
            ((Number) b.getOrDefault("approvedAt", b.getOrDefault("appliedAt", 0L))).longValue(),
            ((Number) a.getOrDefault("approvedAt", a.getOrDefault("appliedAt", 0L))).longValue()
        ));

        return ResponseEntity.ok(accepted);
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
