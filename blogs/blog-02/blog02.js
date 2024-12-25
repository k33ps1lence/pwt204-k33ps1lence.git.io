function labs(number) {
    const content = {
        1: `    <div class="title">
        <!-- Lab 1 -->
    <h1>Lab 1 - Configuring basic security controls on a CentOS Linux Server</h1>
    
    </div>
    <div class="content" style="font-size: 20px;">
        <h2> Objective of LAB</h2>
        <p>
            - Configure the bootloader password credential to mitigate tampering with the GRUB loader and the boot sequence of the server.
            <br>- Configure user groups with limited sudo access (with password credentials) tp log and properly monitor access across the system.
            <br>- Using the firewallld on CentosOS 7
            <br>- How to use immutable permission.
            <br>- How to use ACL permission.
        </p>
    </div>
    <div class="content">
        <h3>Part 1: Harden the GRUB Boot Loader</h3>
    <p>
        1. Generate a hash for the password be running command <b>grub2-mkpasswd-pbkdf2</b>
        <pre>
[root@localhost ~]# grub2-mkpasswd-pbkdf2
Enter password:
Reenter password:
PBKDF2 hash of your password is grub.pbkdf2.sha512.10000.D53E95611BC105B06905E8465199DE25587905217010F5
A504526D1D7B7917FF572BFCCDB2195E2ADE5143E5A9722DF19C1E5059F455540262A17C130DFA6764.044B7E5F6A884132CFBA
2C1251CB887EE32A1B3304E96126580CF6D5F103AE4175ACC5EDC71E62FDA107D8E8A132D3C457B242E546535A8320F1A6E854C
7E562
[root@localhost ~]#</pre>
        <br>2. We have the encrypted password which we have to set on GRUB2 Bootloader main configuration file
        which is <b>grub.cfg</b>. We  have to copy the encrypted password on GRUB2 custom menu i.e.<b>40_custom</b> which is located at 
        <b>/etc/grub.d/</b>.
        <pre>[root@localhost ~]# cd /etc/grub.d
[root@localhost grub.d]# ls
00_header  01_users  20_linux_xen     30_os-prober  41_custom
00_tuned   10_linux  20_ppc_terminfo  40_custom     README</pre>
        <br>3. Before edit the <b>40_custom</b> menu file we recommend you to take a backup of this file first.
        <pre>[root@localhost grub.d]# cp 40_custom 40_custom_backup
[root@localhost grub.d]# ls
00_header  10_linux         30_os-prober      41_custom
00_tuned   20_linux_xen     40_custom         README
01_users   20_ppc_terminfo  40_custom_backup
[root@localhost grub.d]#</pre>
        <br>4. In the following we will use superuser account name <b>"admin"</b>.
        <pre>[root@localhost grub.d]# vi 40_custom</pre>
        <pre>#!/bin/sh
exec tail -n +3 $0
# This file provides an easy way to add custom menu entries.  Simply type the
# menu entries you want to add after this comment.  Be careful not to change
# the 'exec tail' line above.
set superuser="admin"
PBKDF2 hash of your password is grub.pbkdf2.sha512.10000.D53E95611BC105B06905E8465199DE25587905217010F5A504526D1D7B7917
FF572BFCCDB2195E2ADE5143E5A9722DF19C1E5059F455540262A17C130DFA6764.044B7E5F6A884132CFBA2C1251CB887EE32A1B3304E96126580C
F6D5F103AE4175ACC5EDC71E62FDA107D8E8A132D3C457B242E546535A8320F1A6E854C7E562.</pre>
        <br>5. Review your file.
        <br>6. Let start update the <b>grub.cfg</b> file by using command grub2-mmkconfig, but first we should backup the <b>grub.cfg</b> file 
        <pre>[root@localhost grub.d]# cd /boot/grub2
[root@localhost grub2]# cp grub.cfg grub.cfg.backup
[root@localhost grub2]# grub2-mkconfig -o /boot/grub2/grub.cfg
Generating grub configuration file ...
Found linux image: /boot/vmlinuz-3.10.0-327.10.1.el7.x86_64
Found initrd image: /boot/initramfs-3.10.0-327.10.1.el7.x86_64.img
Found linux image: /boot/vmlinuz-0-rescue-106d5d9c8b8d4fb9b8d8bab62a7c05f5
Found initrd image: /boot/initramfs-0-rescue-106d5d9c8b8d4fb9b8d8bab62a7c05f5.img
done
[root@localhost grub2]#</pre>
        7. After update the GRUB2 Bootloader main configuration file the encrypted password will set on <b>grub.cfg</b> file,
        We can check it by open the file using cat or less command and we can see as below the password is there on <b>grub.cfg</b>
        file on the <b>40_custom</b> Section. Type <b>cat grub.cfg</b> to see the result.
        <br>
        <pre>[root@localhost grub2]# cat grub.cfg
...
### BEGIN /etc/grub.d/40_custom ###
# This file provides an easy way to add custom menu entries.  Simply type the
# menu entries you want to add after this comment.  Be careful not to change
# the 'exec tail' line above.
set superuser="admin"
PBKDF2 hash of your password is grub.pbkdf2.sha512.10000.D53E95611BC105B06905E8465199DE25587905217010F5A504526D1D7B7917FF572BFC
CDB2195E2ADE5143E5A9722DF19C1E5059F455540262A17C130DFA6764.044B7E5F6A884132CFBA2C1251CB887EE32A1B3304E96126580CF6D5F103AE4175AC
C5EDC71E62FDA107D8E8A132D3C457B242E546535A8320F1A6E854C7E562.
### END /etc/grub.d/40_custom ###
...
        </pre>
        8. Now let restart the system to check if GRUB Bootloader is protected with password that we have set above.
        <br>9. After restart the system interrupt the nomal boot process be pressing SPACE BAR and select the GRUB menu as highlighted in the picture below and then press <b>e</b> to edit the GRUB.
    </p>
    </div>
    <div class="content">
        <h3>Part 2: Configure the firewall in CentOS</h3>
    <p>1. List all zone on the system,</p>
    <pre>[root@localhost ~]# firewall-cmd --get-zones
block dmz drop external home internal public trusted work</pre>
    <p>2. Check the default zone.</p>
    <pre>[root@localhost ~]# firewall-cmd --get-default-zone
public</pre>
    <p>3. Check the active zone</p>
    <pre>[root@localhost ~]# firewall-cmd --get-active-zones
public
  interfaces: eno16777736</pre>
    <p>4. List all rules of all zones</p>
    <pre>[root@localhost ~]# firewall-cmd --list-all-zones
block
  interfaces:
  sources:
  services:
  ports:
  masquerade: no
  forward-ports:
  icmp-blocks:
  rich rules:

dmz
  interfaces:
  sources:
  services: ssh
  ports:
  masquerade: no
  forward-ports:
  icmp-blocks:
  rich rules:

drop
  interfaces:
  sources:
  services:
  ports:
  masquerade: no
  forward-ports:
  icmp-blocks:
  rich rules:

external
  interfaces:
  sources:
  services: ssh
  ports:
  masquerade: yes
  forward-ports:
  icmp-blocks:
  rich rules:

home
  interfaces:
  sources:
  services: dhcpv6-client ipp-client mdns samba-client ssh
  ports:
  masquerade: no
  forward-ports:
  icmp-blocks:
  rich rules:

internal
  interfaces:
  sources:
  services: dhcpv6-client ipp-client mdns samba-client ssh
  ports:
  masquerade: no
  forward-ports:
  icmp-blocks:
  rich rules:

public (default, active)
  interfaces: eno16777736
  sources:
  services: dhcpv6-client ssh
  ports:
  masquerade: no
  forward-ports:
  icmp-blocks:
  rich rules:

trusted
  interfaces:
  sources:
  services:
  ports:
  masquerade: no
  forward-ports:
  icmp-blocks:
  rich rules:

work
  interfaces:
  sources:
  services: dhcpv6-client ipp-client ssh
  ports:
  masquerade: no
  forward-ports:
  icmp-blocks:
  rich rules:</pre>
    <p>5. List all rules of specific zone.</p>
    <pre>[root@localhost ~]# firewall-cmd --zone=public --list-all
public (default, active)
  interfaces: eno16777736
  sources:
  services: dhcpv6-client ssh
  ports:
  masquerade: no
  forward-ports:
  icmp-blocks:
  rich rules:</pre>
    <p>6. List services and ports in specific zone.</p>
    <pre>[root@localhost ~]# firewall-cmd --zone=public --list-ports
[root@localhost ~]# firewall-cmd --zone=public --list-services
dhcpv6-client ssh</pre>
    <p>7. Check all services on the system.</p>
    <pre>[root@localhost ~]# firewall-cmd --get-services
RH-Satellite-6 amanda-client bacula bacula-client dhcp dhcpv6 dhcpv6-client dns
freeipa-ldap freeipa-ldaps freeipa-replication ftp high-availability http https
imaps ipp ipp-client ipsec iscsi-target kerberos kpasswd ldap ldaps libvirt libvirt-tls
mdns mountd ms-wbt mysql nfs ntp openvpn pmcd pmproxy pmwebapi pmwebapis pop3s postgresql 
proxy-dhcp radius rpc-bind rsyncd samba samba-client smtp ssh telnet tftp tftp-client 
transmission-client vdsm vnc-server wbem-https</pre>
    <p>8. Allow a service on firewalld. In this example, we will add http into the public zone.</p>
    <pre>[root@localhost ~]# firewall-cmd --zone=public --add-service=http
success
[root@localhost ~]# firewall-cmd --zone=public --list-services
dhcpv6-client http ssh</pre>
    <p>9. Opent a port on a specific zone.</p>
    <pre>[root@localhost ~]# firewall-cmd --zone=public --add-port=10000/tcp
success
[root@localhost ~]# firewall-cmd --zone=public --add-port=9990-9999/tcp
success
[root@localhost ~]# firewall-cmd --zone=public --list-ports
9990-9999/tcp 10000/tcp</pre>
    </div>
    <div class="content">
        <h3>Part 3: ACL(Access Control List)</h3>
    <p>1.  On the terminal. Making a new file by typing the following command:</p>
    <pre>[root@localhost ~]# ll
total 4
-rw-------. 1 root root 1094 Dec 17 09:30 anaconda-ks.cfg
-rw-r--r--. 1 root root    0 Dec 18 11:10 demo.txt
[root@localhost ~]#</pre>
    <p>2. View the ACL of demo.txt file:</p>
    <pre>[root@localhost ~]# getfacl  demo.txt
# file: demo.txt
# owner: root
# group: root
user::rw-
group::r--
other::r--
[root@localhost ~]#</pre>
    <p>3. Add the read and write ACL permisstions to <b>your_group</b>.</p>
    <pre>[root@localhost ~]# setfacl -m g:tina:rw demo.txt
[root@localhost ~]# getfacl demo.txt
# file: demo.txt
# owner: root
# group: root
user::rw-
group::r--
group:tina:rw-
mask::rw-
other::r--
</pre>
    </div>
    <div class="content">
        <h3>Part 4: Add user to Sudoer</h3>
    <p>1. After create a new user, you must be run the usermod command to add the user to the wheel group. By default
        , on CentOS, members of the wheel group have sudo privileges.</p>
    <pre>[root@localhost ~]# usermod -aG wheel tina</pre>
    <p>2. Use the <b>su</b> command to switch to the new user account.</p>
    <pre>[root@localhost ~]# su tina
[tina@localhost root]$</pre>
    <p>3. For example, you can list the contents of the <b>/root</b> dicrectory, which is nomally only accesscible to the root user.</p>
    <pre>[tina@localhost root]$ sudo ls -la /root/
[sudo] password for tina:
total 40
dr-xr-x---.  2 root root 4096 Dec 18 11:10 .
dr-xr-xr-x. 17 root root 4096 Dec 17 09:30 ..
-rw-------.  1 root root 1094 Dec 17 09:30 anaconda-ks.cfg
-rw-------.  1 root root  523 Dec 18 10:34 .bash_history
-rw-r--r--.  1 root root   18 Dec 28  2013 .bash_logout
-rw-r--r--.  1 root root  176 Dec 28  2013 .bash_profile
-rw-r--r--.  1 root root  176 Dec 28  2013 .bashrc
-rw-r--r--.  1 root root  100 Dec 28  2013 .cshrc
-rw-rw-r--+  1 root root    0 Dec 18 11:10 demo.txt
-rw-r--r--.  1 root root  129 Dec 28  2013 .tcshrc</pre>
    </div>
    <div class="content">
    <h3>Part 5: Set immutable Permission</h3>
    <p>1. Create a new file bt using this command:</p>
    <p>2. Set immutable permisstion to demo.txt file and view the result.</p>
    <pre>[root@localhost ~]# chattr +i demo.txt
[root@localhost ~]# lsattr demo.txt
----i----------- demo.txt</pre>
    <p>3. Try to delete that file</p>
    <pre>[root@localhost ~]# rm demo.txt
rm: remove regular empty file ‘demo.txt’? y
rm: cannot remove ‘demo.txt’: Operation not permitted</pre>
    <p>4. Try to move that file</p>
    <pre>[root@localhost ~]# mv demo.txt /home
mv: cannot move ‘demo.txt’ to ‘/home/demo.txt’: Operation not permitted</pre>
    <p>5. Finally, try to copy that file</p>
    <pre>[root@localhost ~]# cp demo.txt /home</pre>
    </div>`,
    2: `<div class="title">
            <h1>LAB 2 -  Configuring Basic Security Controls on a CentOS Linux Server</h1>
        </div>
        <div class="content">
            <p>
                In this lab series, you will configure basic security controls on a CentOS Linux server using various firewall tools, 
                including iptables, nftables, and firewalld. The objectives for each part of the lab are as follows: 
                <br><b>4.1 – Basic iptables usage:</b>
                <ul>
                    <li>Understand the basics of iptables.</li>
                    <li>Disable the Uncomplicated Firewall (ufw) and work directly with iptables.</li>
                    <li>Create a basic firewall configuration allowing SSH access, DNS queries, and ICMP, while denying all orther incoming traffic.</li>
                    <li>Verify the iptables rules and make them persistent.</li>
                    <li>Practice using snapshots for system recovery.</li>
                </ul>
                <b>4.2 - Blocking invalid IPv4 packets:</b>
                <ul>
                    <li>View existing rules in filter and mangle tables.</li>
                    <li>Block invalid IPv4 packets and TCP packetsthat don't have the SYN flag set.</li>
                    <li>Observe the effects of blocking invalid packets.</li>
                    <li>Improve firewall efficiency using the PREROUTING chain of the mangle table.</li>
                </ul>
                <b>4.3 Configure ip6tables:</b>
                <ul>
                    <li>Create an IPv6 firewall alongside an existing IPv4 firewall.</li>
                    <li>Block invalid IPv6 packets and TCP packets without the SYN flag.</li>
                    <li>Test the IPv6 firewall with Nmap scans</li>
                    <li>Observe the rules and packet counters for IPv6</li>
                </ul>
                <b>4.4 - Configure nftables on Ubuntu:</b>
                <ul>
                    <li>Set up nftables on an Ubuntu virtual machine.</li>
                    <li>Create a custom firewall configuration with nftables.</li>
                    <li>Test the firewall be performing Nmap scans.</li>
                    <li>Observe the rules and packet counters in the nftables configuration.</li>
                    <li>Learn to block invalid packets with nftables.</li>
                </ul>
                <b>4.5 - Basic ufw usage:</b>
                <ul>
                    <li>Work with the Uncomplicated Firewall (ufw) on Ubuntu.</li>
                    <li>Enable, configure, and disable ufw.</li>
                    <li>Open specific ports and services using ufw.</li>
                    <li>Motify ufw configuration files for advanced rules.</li>
                    <li>Obverse the effects of ufw rules on iptables or nftables.</li>
                </ul>
                <b>4.6 - Firewalld commands:</b>
                <ul>
                    <li>Learn firewalld basics on CentOS or Almalinux.</li>
                    <li>Explore firewalld zones, services, and predefined rules.</li>
                    <li>Modify the defaultzone and add services.</li>
                    <li>Block ICMP types, log denied packets, and set firewall rules.</li>
                    <li>View, compare, and make runtime and permanent firewall configurations.</li>
                    <li>Use direct rules to block invalid packets and observe their effects.</li>
                    <li>Test firewall configirations with Nmap scanes.</li>
                    <li>Explore firewalld-related man pages.</li>
                </ul>
            </p>
        </div>
        <div class="content">
            <h2>Some Important Concepts</h2>
            <p>
                <b>What is Firewall?</b>
                <br>A firewall is a network security device or software designed to monitor, control, and filter incoming and outgoing network traffic based on predefined security rules. It acts as a barrier between a trusted internal network and untrusted external networks, such as the internet, to protect the system from unauthorized access and cyber threats.
            </p>
            <p>
                <b>What is iptables?</b>
                <br><b>iptable</b> is a command-line tool for setting up, maintaining, and testing firewall tables in Linux. It controls network filtering, dropping or allowing packets based on defined rules.
            </p>
        </div>
        <div class="content">
            <h2>4.1 - Basic iptables usage</h2>
            <pre>sudo iptables -L</pre>
            <p>
                Lists the current rules in all chains (INPUT, OUTPUT, FORWARD) and default tables (filter).
            </p>
            <pre>sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT</pre>
            <pre>sudo iptables -A INPUT -p tcp --dport ssh -j ACCEPT</pre>
            <pre>sudo iptables -A INPUT -p tcp --dport 53 -j ACCEPT</pre>
            <pre>sudo iptables -A INPUT -p udp --dport 53 -j ACCEPT</pre>
            <pre>sudo iptables -A INPUT -m conntrack -p icmp --icmp-type 3 --ctstate NEW,ESTABLISHED,RELATED -j ACCEPT</pre>
            <pre>sudo iptables -A INPUT -m conntrack -p icmp --icmp-type 11 --ctstate NEW,ESTABLISHED,RELATED -j ACCEPT</pre>
            <pre>sudo iptables -A INPUT -m conntrack -p icmp --icmp-type 12 --ctstate NEW,ESTABLISHED,RELATED -j ACCEPT</pre>
            <pre>sudo iptables -A INPUT -j DROP</pre>
        </div>
        <div class="content">
            <h2>4.2 - Blocking invalid IPv4 packets</h2>
        </div>
        <div class="content">
            <h2>4.3 - Configure ip6tables</h2>
        </div>
        <div class="content">
            <h2>4.4 - Configure nftables on Ubuntu</h2>
        </div>
        <div class="content">
            <h2>4.5 - Basic ufw usage</h2>
        </div>
        <div class="content">
            <h2>4.6 - Firewalld commands</h2>
        </div>`,
    };
    switch (number) {
        case 1:
            document.getElementById('lab-01').innerHTML = content[1];
            break;
        case 2:
            document.getElementById('lab-01').innerHTML = content[2];
            break;
    }

}