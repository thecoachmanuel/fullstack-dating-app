import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";

const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config();
}

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const PASSWORD = "password";

function isServiceRole(key: string): boolean {
  try {
    const parts = key.split(".");
    if (parts.length < 2) return false;
    const payloadJson = Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    const payload = JSON.parse(payloadJson);
    return payload?.role === "service_role";
  } catch {
    return false;
  }
}

if (!SUPABASE_URL) {
  console.error("❌ Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in environment");
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY || !isServiceRole(SUPABASE_SERVICE_ROLE_KEY)) {
  console.error(
    "❌ Invalid SUPABASE_SERVICE_ROLE_KEY. Please paste the Service Role key (role=service_role) from Supabase Settings → API"
  );
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Fake profile data
const fakeProfiles = [
  {
    full_name: "Sarah Johnson",
    username: "sarah_j",
    email: "sarah.johnson@example.com",
    gender: "female" as const,
    birthdate: "1995-03-15",
    bio: "Love hiking, coffee, and good conversations. Looking for someone to explore the world with! 🌍",
    avatar_url:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 25, max: 35 },
      distance: 50,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "Alex Chen",
    username: "alex_c",
    email: "alex.chen@example.com",
    gender: "female" as const,
    birthdate: "1992-07-22",
    bio: "Passionate about photography and travel. Always up for an adventure! 📸✈️",
    avatar_url:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 28, max: 38 },
      distance: 30,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "Emma Wilson",
    username: "emma_w",
    email: "emma.wilson@example.com",
    gender: "female" as const,
    birthdate: "1990-11-08",
    bio: "Book lover and yoga enthusiast. Seeking someone who values personal growth and meaningful conversations. 📚🧘‍♀️",
    avatar_url:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 30, max: 40 },
      distance: 25,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "Michael Rodriguez",
    username: "mike_r",
    email: "michael.rodriguez@example.com",
    gender: "male" as const,
    birthdate: "1988-05-12",
    bio: "Tech enthusiast and fitness lover. Looking for someone to share adventures and good food with! 💻🏋️‍♂️",
    avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 25, max: 35 },
      distance: 40,
      gender_preference: ["female"],
    },
  },
  {
    full_name: "Jessica Kim",
    username: "jess_k",
    email: "jessica.kim@example.com",
    gender: "female" as const,
    birthdate: "1993-09-18",
    bio: "Artist and coffee addict. Love exploring new places and meeting interesting people. 🎨☕",
    avatar_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 26, max: 36 },
      distance: 35,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "David Thompson",
    username: "dave_t",
    email: "david.thompson@example.com",
    gender: "male" as const,
    birthdate: "1989-12-03",
    bio: "Musician and outdoor enthusiast. Guitar, hiking, and good vibes only! 🎸🏔️",
    avatar_url:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 24, max: 34 },
      distance: 45,
      gender_preference: ["female"],
    },
  },
  {
    full_name: "Sophie Martin",
    username: "sophie_m",
    email: "sophie.martin@example.com",
    gender: "female" as const,
    birthdate: "1994-02-28",
    bio: "Foodie and travel blogger. Always on the hunt for the best restaurants and hidden gems! 🍕✈️",
    avatar_url:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 27, max: 37 },
      distance: 30,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "Ryan Park",
    username: "ryan_p",
    email: "ryan.park@example.com",
    gender: "male" as const,
    birthdate: "1991-06-14",
    bio: "Entrepreneur and fitness coach. Passionate about helping others achieve their goals! 💪🚀",
    avatar_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 25, max: 35 },
      distance: 50,
      gender_preference: ["female"],
    },
  },
  {
    full_name: "Isabella Garcia",
    username: "bella_g",
    email: "isabella.garcia@example.com",
    gender: "female" as const,
    birthdate: "1996-08-07",
    bio: "Dance instructor and fitness enthusiast. Love spreading positivity and good energy! 💃✨",
    avatar_url:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 23, max: 33 },
      distance: 25,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "James Anderson",
    username: "james_a",
    email: "james.anderson@example.com",
    gender: "male" as const,
    birthdate: "1987-04-25",
    bio: "Software engineer and board game enthusiast. Looking for someone to share nerdy adventures with! 👨‍💻🎲",
    avatar_url:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 26, max: 36 },
      distance: 40,
      gender_preference: ["female"],
    },
  },
];

async function createFakeProfiles() {
  console.log("🚀 Starting to create fake profiles...");

  for (let i = 0; i < fakeProfiles.length; i++) {
    const profile = fakeProfiles[i];

    try {
      console.log(`\n📝 Creating profile ${i + 1}/10: ${profile.full_name}`);

      // 1. Check if auth user already exists
      const { data: existingAuthUsers } = await supabase.auth.admin.listUsers();
      const existingAuthUser = existingAuthUsers.users.find(
        (u) => u.email === profile.email
      );

      let userId: string;

      if (existingAuthUser) {
        console.log(
          `⚠️ Auth user already exists for ${profile.full_name}, using existing...`
        );
        userId = existingAuthUser.id;
      } else {
        // Create new auth user
        const { data: authData, error: authError } =
          await supabase.auth.admin.createUser({
            email: profile.email,
            password: PASSWORD,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
              full_name: profile.full_name,
              username: profile.username,
            },
          });

        if (authError) {
          console.error(
            `❌ Error creating auth user for ${profile.full_name}:`,
            authError
          );
          continue;
        }

        userId = authData.user.id;
        console.log(`✅ Auth user created: ${userId}`);
      }

      // 2. Check if user profile already exists
      const { data: existingProfile } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .single();

      if (existingProfile) {
        console.log(
          `⚠️ Profile already exists for ${profile.full_name}, updating...`
        );

        // Update existing profile with new data
        const { error: updateError } = await supabase
          .from("users")
          .update({
            full_name: profile.full_name,
            username: profile.username,
            email: profile.email,
            gender: profile.gender,
            birthdate: profile.birthdate,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            preferences: profile.preferences,
            location_lat: faker.location.latitude({ min: 37.7, max: 37.8 }), // San Francisco area
            location_lng: faker.location.longitude({
              min: -122.5,
              max: -122.4,
            }),
            is_verified: true,
            is_online: Math.random() > 0.5,
          })
          .eq("id", userId);

        if (updateError) {
          console.error(
            `❌ Error updating profile for ${profile.full_name}:`,
            updateError
          );
          continue;
        }
      } else {
        // Insert new user profile data
        const { error: profileError } = await supabase.from("users").insert({
          id: userId,
          full_name: profile.full_name,
          username: profile.username,
          email: profile.email,
          gender: profile.gender,
          birthdate: profile.birthdate,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          preferences: profile.preferences,
          location_lat: faker.location.latitude({ min: 37.7, max: 37.8 }), // San Francisco area
          location_lng: faker.location.longitude({ min: -122.5, max: -122.4 }),
          is_verified: true,
          is_online: Math.random() > 0.5,
        });

        if (profileError) {
          console.error(
            `❌ Error creating profile for ${profile.full_name}:`,
            profileError
          );
          // Try to clean up the auth user if profile creation fails
          await supabase.auth.admin.deleteUser(userId);
          continue;
        }
      }

      console.log(`✅ Profile created successfully for ${profile.full_name}`);
      console.log(`   📧 Email: ${profile.email}`);
      console.log(`   🔑 Password: ${PASSWORD}`);
      console.log(`   👤 Username: ${profile.username}`);
    } catch (error) {
      console.error(
        `❌ Unexpected error creating profile for ${profile.full_name}:`,
        error
      );
    }
  }

  console.log("\n🎉 Fake profile creation completed!");
  console.log("\n📋 Summary:");
  console.log('All accounts use password: "password"');
  console.log("All emails are auto-confirmed");
  console.log("Profiles include random location data in San Francisco area");
  console.log("Some users are marked as online for testing");
}

// Run the script
createFakeProfiles().catch(console.error);
