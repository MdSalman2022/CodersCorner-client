"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Plus,
  X,
  Save,
  User,
  Link as LinkIcon,
  MapPin,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { MediumHeader } from "@/components/medium-header";

interface UserProfile {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  skills: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  preferences: {
    topics: string[];
    darkMode: boolean;
  };
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
}

export default function ProfileEditPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    website: "",
    location: "",
    skills: [] as string[],
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
    },
    preferences: {
      topics: [] as string[],
      darkMode: false,
    },
  });

  const [newSkill, setNewSkill] = useState("");
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        website: profile.website || "",
        location: profile.location || "",
        skills: profile.skills || [],
        socialLinks: {
          github: profile.socialLinks?.github || "",
          linkedin: profile.socialLinks?.linkedin || "",
          twitter: profile.socialLinks?.twitter || "",
        },
        preferences: {
          topics: profile.preferences?.topics || [],
          darkMode: profile.preferences?.darkMode || false,
        },
      });
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user?.id}`
      );
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
      } else {
        setError("Failed to load profile");
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile.user);
        alert("Profile updated successfully!");
      } else {
        const error = await response.json();
        setError(error.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addTopic = () => {
    if (
      newTopic.trim() &&
      !formData.preferences.topics.includes(newTopic.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          topics: [...prev.preferences.topics, newTopic.trim()],
        },
      }));
      setNewTopic("");
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        topics: prev.preferences.topics.filter(
          (topic) => topic !== topicToRemove
        ),
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MediumHeader />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-background">
        <MediumHeader />
        <main className="container mx-auto px-4 py-8 max-w-4xl text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Profile</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchProfile}>Try Again</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MediumHeader />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.avatar} />
                      <AvatarFallback className="text-lg">
                        {profile?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{profile?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Your display name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Social Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="github" className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub
                    </Label>
                    <Input
                      id="github"
                      value={formData.socialLinks.github}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            github: e.target.value,
                          },
                        }))
                      }
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="linkedin"
                      className="flex items-center gap-2"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            linkedin: e.target.value,
                          },
                        }))
                      }
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="twitter"
                      className="flex items-center gap-2"
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </Label>
                    <Input
                      id="twitter"
                      value={formData.socialLinks.twitter}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            twitter: e.target.value,
                          },
                        }))
                      }
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button onClick={addSkill} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {skill}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>

                  {formData.skills.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No skills added yet. Add some skills to showcase your
                      expertise!
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Preferences</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Customize your content preferences and reading experience.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">
                        Favorite Topics
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add topics you're interested in to personalize your
                        feed.
                      </p>
                      <div className="flex gap-2 mb-3">
                        <Input
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          placeholder="Add a topic..."
                          onKeyPress={(e) => e.key === "Enter" && addTopic()}
                        />
                        <Button onClick={addTopic} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {formData.preferences.topics.map((topic) => (
                          <Badge
                            key={topic}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            {topic}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-destructive"
                              onClick={() => removeTopic(topic)}
                            />
                          </Badge>
                        ))}
                      </div>

                      {formData.preferences.topics.length === 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          No topics added yet. Add some topics to personalize
                          your experience!
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label
                          htmlFor="darkMode"
                          className="text-base font-medium"
                        >
                          Dark Mode
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Enable dark mode for better reading in low light.
                        </p>
                      </div>
                      <Switch
                        id="darkMode"
                        checked={formData.preferences.darkMode}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              darkMode: checked,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
