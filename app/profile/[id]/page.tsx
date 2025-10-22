"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  Users,
  FileText,
  Heart,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface UserProfile {
  userId: string;
  betterAuthId: string;
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
  followers: string[];
  following: string[];
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  likes: string[];
  isFeatured: boolean;
  coverImage?: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  console.log("isOwnProfile", isOwnProfile);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${id}`
      );
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
        fetchUserPosts();
      } else {
        setError("Profile not found");
      }
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);
  console.log("user id", user);
  console.log("profile userid", profile);

  useEffect(() => {
    if (profile && user) {
      const isOwn = user.id === profile.betterAuthId;
      setIsOwnProfile(isOwn);

      if (!isOwn && user._id) {
        const isFollowingThisUser = profile.followers.includes(user._id);
        setIsFollowing(isFollowingThisUser);
      }
    } else if (!user) {
      setIsOwnProfile(false);
    }
  }, [profile, user]);

  console.log("isFollowing", isFollowing);

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?author=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch {
      console.error("Failed to fetch user posts");
    }
  };

  const handleFollow = async () => {
    if (user?.id === profile?.betterAuthId) {
      alert("You cannot follow yourself");
      return;
    }

    if (!user) {
      alert("Please sign in to follow users");
      return;
    }

    try {
      const method = isFollowing ? "DELETE" : "POST";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${id}/follow`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      if (response.ok) {
        console.log("🔄 Refetching profile after follow/unfollow...");
        await fetchProfile();
      } else {
        const error = await response.json();
        alert(
          `Failed to ${isFollowing ? "unfollow" : "follow"}: ${error.message}`
        );
      }
    } catch (error) {
      console.error("Follow error:", error);
      alert(`Failed to ${isFollowing ? "unfollow" : "follow"}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 bg-muted rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded w-48"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
              </div>
            </div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-4xl text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-24 w-24 mx-auto md:mx-0">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-2xl">
                    {profile.name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>

                  {profile.bio && (
                    <p className="text-muted-foreground mb-4">{profile.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
                    {profile.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </div>
                    )}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <LinkIcon className="h-4 w-4" />
                        Website
                      </a>
                    )}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(profile.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3 justify-center md:justify-start mb-4">
                    {profile.socialLinks?.github && (
                      <a
                        href={`https://github.com/${profile.socialLinks.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        GitHub
                      </a>
                    )}
                    {profile.socialLinks?.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        LinkedIn
                      </a>
                    )}
                    {profile.socialLinks?.twitter && (
                      <a
                        href={`https://twitter.com/${profile.socialLinks.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        Twitter
                      </a>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 justify-center md:justify-start mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {profile.stats.postsCount}
                      </div>
                      <div className="text-sm text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {profile.stats.followersCount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Followers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {profile.stats.followingCount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Following
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!isOwnProfile && (
                    <Button
                      onClick={handleFollow}
                      variant={isFollowing ? "outline" : "default"}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Content Tabs */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">
                Posts ({profile.stats.postsCount})
              </TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile
                        ? "Start writing your first post!"
                        : "This user hasn't published any posts yet."}
                    </p>
                    {isOwnProfile && (
                      <Link href="/write" className="mt-4 inline-block">
                        <Button>Write Post</Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card
                    key={post._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(
                            post.publishedAt
                          ).toLocaleDateString()} • {post.readingTime} min read
                        </div>

                        <h3 className="text-xl font-semibold hover:text-primary cursor-pointer">
                          <Link href={`/posts/${post._id}`}>{post.title}</Link>
                        </h3>

                        {post.excerpt && (
                          <p className="text-muted-foreground">
                            {post.excerpt}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              <span className="text-sm">
                                {post.likes.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Activity Feed</h3>
                  <p className="text-muted-foreground">
                    Activity feed coming soon! This will show recent posts,
                    comments, and interactions.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
