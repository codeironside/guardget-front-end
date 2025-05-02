import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
          <Image
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1920&auto=format&fit=crop"
            alt="About Guardget"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="headline mb-6 text-foreground">About Guardget</h1>
            <p className="text-xl mb-8 text-muted-foreground font-light">
              We're on a mission to protect your devices and give you peace of
              mind in an increasingly connected world.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Our Mission</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Guardget's mission is to create a safer environment for device
                  owners by providing innovative tracking and recovery solutions
                  that protect valuable assets and personal data.
                </p>
                <p className="text-muted-foreground">
                  We aim to reduce device theft and unauthorized resale through
                  our comprehensive database and verification system, making it
                  harder for thieves to profit from stolen devices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Our Vision</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  We envision a world where device theft is no longer
                  profitable, where every stolen device can be traced, and where
                  owners can recover their valuable possessions with ease.
                </p>
                <p className="text-muted-foreground">
                  Guardget strives to be the leading device protection service
                  in Africa and beyond, creating a global network that makes
                  device theft obsolete.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
              <p className="text-muted-foreground">
                The journey of Guardget began with a personal experience of loss
                and frustration.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">The Beginning</h3>
                <p className="text-muted-foreground">
                  Guardget was founded in 2022 after our founder lost his
                  smartphone at a busy market in Lagos. Despite reporting to the
                  police and trying to track the device, it was never recovered.
                  This experience highlighted the need for a better solution to
                  protect and recover stolen devices.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">The Problem</h3>
                <p className="text-muted-foreground">
                  In Nigeria and across Africa, device theft is rampant, with
                  thousands of phones and laptops stolen daily. Most of these
                  devices are resold quickly, with buyers unaware they're
                  purchasing stolen goods. Existing solutions were either
                  ineffective or too expensive for the average user.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">The Solution</h3>
                <p className="text-muted-foreground">
                  We created Guardget to address this gap – an affordable,
                  accessible service that allows users to register their
                  devices, report theft or loss, and verify the status of
                  devices before purchase. By creating a comprehensive database
                  and verification system, we're making it harder for thieves to
                  profit from stolen devices.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Today</h3>
                <p className="text-muted-foreground">
                  Today, Guardget serves thousands of users across Nigeria, with
                  plans to expand throughout Africa. We've helped recover
                  hundreds of devices and prevented many more from being stolen
                  through our deterrent effect. Our vision is to create a world
                  where device theft is no longer profitable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Meet the Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our dedicated team of professionals is committed to protecting
              your devices and providing exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative h-40 w-40 rounded-full overflow-hidden mx-auto mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces&auto=format"
                    alt="Team Member"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Oluwaseun Adebayo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Founder & CEO
                </p>
                <p className="text-sm text-muted-foreground">
                  Tech entrepreneur with a passion for creating solutions that
                  address real-world problems in Africa.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative h-40 w-40 rounded-full overflow-hidden mx-auto mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces&auto=format"
                    alt="Team Member"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Amina Ibrahim</h3>
                <p className="text-sm text-muted-foreground mb-4">CTO</p>
                <p className="text-sm text-muted-foreground">
                  Software engineer with expertise in cybersecurity and device
                  tracking technologies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative h-40 w-40 rounded-full overflow-hidden mx-auto mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces&auto=format"
                    alt="Team Member"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Chukwudi Okonkwo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Head of Operations
                </p>
                <p className="text-sm text-muted-foreground">
                  Operations expert with experience in logistics and customer
                  service management.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative h-40 w-40 rounded-full overflow-hidden mx-auto mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces&auto=format"
                    alt="Team Member"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Ngozi Eze</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customer Success Manager
                </p>
                <p className="text-sm text-muted-foreground">
                  Dedicated to ensuring our customers have the best experience
                  with our services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">Join Our Mission</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Be part of the movement to make device theft a thing of the past.
            Register your devices today and enjoy peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Register Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
